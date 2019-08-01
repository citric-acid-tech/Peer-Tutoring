<div id="footer">
    <div id="footer-content" class="col-xs-12 col-sm-8">
        <a href="https://cle.sustech.edu.cn/">CENTER FOR LANGUAGE EDUCATION</a>
        <span id="select-language" class="label label-success">
        	<?= ucfirst($this->config->item('language')) ?>
        </span>
        |
        <a href="<?= site_url('appointments') ?>">
            <?= lang('go_to_booking_page') ?>
        </a>
    </div>

    <div id="footer-user-display-name" class="col-xs-12 col-sm-4">
        <?= lang('hello') . ', ' . $user_display_name ?>!
    </div>
</div>

<script src="<?= asset_url('assets/js/backend.js') ?>"></script>
<script src="<?= asset_url('assets/js/general_functions.js') ?>"></script>
</body>
</html>
