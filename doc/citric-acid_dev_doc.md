### 上传文件

所有上传的文件都会到upload文件夹内。

1. 文件大小没有限制

2. 文件类型(扩展名)限制在config/constants.php内找到DOCUMENT_FORMAT设置

3. 文件命名规则：

4. 1. 使用上传前的扩展名
   2. 文件名为<cas_hash_id>-<service_id>



### 注册

使用CAS可直接登录系统。对于第一次登录该系统的用户，将自动注册。

注册逻辑：调用Cas_model.php中的get_user_data方法

1. 在ea_users表中插入一条数据，包括first_name (CAS中的用户全名)，email (CAS中的email)，cas_hash_id (CAS中的id)，cas_sid(CAS中的sid)，以及id_roles (设置为3，即学生身份)
2. 在ea_user_settings中插入一条数据，包括id_users (在ea_uisers中新插入的行号)，username (CAS中的sid)