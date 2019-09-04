import { createView, createRoute } from '../frame/index';
import { InteractionMethod } from '../enum/InteractionMethod';
import { item } from './item';
import { attr } from '../../utils/attr';
import { getItemIndexByPosition } from '../utils/getItemIndexByPosition';

const create = ({ root }) => {
    // need to set role to list as otherwise it won't be read as a list by VoiceOver
    attr(root.element, 'role', 'list');

    root.ref.lastItemSpanwDate = Date.now();
};

/**
 * Inserts a new item
 * @param root
 * @param action
 */
const addItemView = ({ root, action }) => {
    const { id, index, interactionMethod } = action;

    root.ref.addIndex = index;

    const now = Date.now();
    let spawnDate = now;
    let opacity = 1;

    if (interactionMethod !== InteractionMethod.NONE) {
        opacity = 0;
        const cooldown = root.query('GET_ITEM_INSERT_INTERVAL');
        const dist = now - root.ref.lastItemSpanwDate;
        spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
    }

    root.ref.lastItemSpanwDate = spawnDate;
    
    root.appendChildView(
        root.createChildView(
            // view type
            item,

            // props
            {
                spawnDate,
                id,
                opacity,
                interactionMethod
            }
        ),
        index
    );
};

const moveItem = (item, x, y, vx = 0, vy = 1) => {

    item.translateX = x;
    item.translateY = y;

    if (Date.now() > item.spawnDate) {

        // reveal element
        if (item.opacity === 0) {
            introItemView(item, x, y, vx, vy);
        }

        // make sure is default scale every frame
        item.scaleX = 1;
        item.scaleY = 1;
        item.opacity = 1;
        
    }
}

const introItemView = (item, x, y, vx, vy) => {

    if (item.interactionMethod === InteractionMethod.NONE) {
        item.translateX = null;
        item.translateX = x;
        item.translateY = null;
        item.translateY = y;
    }

    else if (item.interactionMethod === InteractionMethod.DROP) {

        item.translateX = null;
        item.translateX = x - (vx * 20);

        item.translateY = null;
        item.translateY = y - (vy * 10);
    
        item.scaleX = .8;
        item.scaleY = .8;
    }

    else if (item.interactionMethod === InteractionMethod.BROWSE) {
        item.translateY = null;
        item.translateY = y - 30;
    }

    else if (item.interactionMethod === InteractionMethod.API) {
        item.translateX = null;
        item.translateX = x - 30;
        item.translateY = null;
    }

}

/**
 * Removes an existing item
 * @param root
 * @param action
 */
const removeItemView = ({ root, action }) => {
    const { id } = action;

    // get the view matching the given id
    const view = root.childViews.find(child => child.id === id);

    // if no view found, exit
    if (!view) {
        return;
    }

    // animate view out of view
    view.scaleX = 0.9;
    view.scaleY = 0.9;
    view.opacity = 0;

    // mark for removal
    view.markedForRemoval = true;
};

/**
 * Setup action routes
 */
const route = createRoute({
    DID_ADD_ITEM: addItemView,
    DID_REMOVE_ITEM: removeItemView
});



/**
 * Write to view
 * @param root
 * @param actions
 * @param props
 */
const write = ({ root, props, actions, shouldOptimize }) => {

    // route actions
    route({ root, props, actions });

    const { dragCoordinates } = props;

    // get index
    const dragIndex = dragCoordinates ? getItemIndexByPosition(root, dragCoordinates) : null;

    // available space on horizontal axis
    const horizontalSpace = root.rect.element.width;
    
    // only draw children that have dimensions
    const visibleChildren = root.childViews.filter(child => child.rect.element.height);
    
    // sort based on current active items
    const children = root.query('GET_ACTIVE_ITEMS').map(item => visibleChildren.find(child => child.id === item.id)).filter(item => item);

    // add index is used to reserve the dropped/added item index till the actual item is rendered
    const addIndex = root.ref.addIndex || null;

    // add index no longer needed till possibly next draw
    root.ref.addIndex = null;

    let dragIndexOffset = 0;
    let removeIndexOffset = 0;
    let addIndexOffset = 0;

    if (children.length === 0) return;

    const childRect = children[0].rect.element;
    const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
    const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
    const itemWidth = childRect.width + itemHorizontalMargin;
    const itemHeight = childRect.height + itemVerticalMargin;
    const itemsPerRow = Math.round(horizontalSpace / itemWidth);

    // stack
    if (itemsPerRow === 1) {

        let offsetY = 0;
        let dragOffset = 0;

        children.forEach((child, index) => {

            if (dragIndex) {
                let dist = index - dragIndex;
                if (dist === -2) {
                    dragOffset = -itemVerticalMargin * .25;
                }
                else if (dist === -1) {
                    dragOffset = -itemVerticalMargin * .75;
                }
                else if (dist === 0) {
                    dragOffset = itemVerticalMargin * .75;
                }
                else if (dist === 1) {
                    dragOffset = itemVerticalMargin * .25;
                }
                else {
                    dragOffset = 0;
                }
            }

            if (shouldOptimize) {
                child.translateX = null;
                child.translateY = null;
            }
            
            if (!child.markedForRemoval) {
                moveItem(child, 0, offsetY + dragOffset);
            }

            let itemHeight = child.rect.element.height + itemVerticalMargin;

            let visualHeight = itemHeight * (child.markedForRemoval ? child.opacity : 1);
            
            offsetY += visualHeight;

        });
    }
    // grid
    else {

        let prevX = 0;
        let prevY = 0;

        children.forEach((child, index) => {

            if (index === dragIndex) {
                dragIndexOffset = 1;
            }

            if (index === addIndex) {
                addIndexOffset += 1;
            }
            
            if (child.markedForRemoval && child.opacity < .5) {
                removeIndexOffset -= 1;
            }

            const visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;

            const indexX = (visualIndex % itemsPerRow);
            const indexY = Math.floor(visualIndex / itemsPerRow);

            const offsetX = indexX * itemWidth;
            const offsetY = indexY * itemHeight;

            const vectorX = Math.sign(offsetX - prevX);
            const vectorY = Math.sign(offsetY - prevY);

            prevX = offsetX;
            prevY = offsetY;

            if (child.markedForRemoval) return;

            if (shouldOptimize) {
                child.translateX = null;
                child.translateY = null;
            }
    
            moveItem(child, offsetX, offsetY, vectorX, vectorY);
        });
    }

};

/**
 * Filters actions that are meant specifically for a certain child of the list
 * @param child
 * @param actions
 */
const filterSetItemActions = (child, actions) =>
    actions.filter(action => {
        
        // if action has an id, filter out actions that don't have this child id
        if (action.data && action.data.id) {
            return child.id === action.data.id;
        }

        // allow all other actions
        return true;
    });

export const list = createView({
    create,
    write,
    tag: 'ul',
    name: 'list',
    didWriteView: ({ root }) => {
        root.childViews
        .filter(view => view.markedForRemoval && view.opacity === 0 && view.resting)
        .forEach(view => {
            view._destroy();
            root.removeChildView(view);
        });
    },
    filterFrameActionsForChild: filterSetItemActions,
    mixins: {
        apis: ['dragCoordinates']
    }
});
