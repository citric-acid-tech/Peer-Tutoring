		<!-- Home Footer -->
		<div id="footer">
			<div id="footer-content" class="col-xs-12 col-sm-8">
		        <a href="https://cle.sustech.edu.cn/" target="_blank">
		        	CENTER FOR LANGUAGE EDUCATION
		        </a>
		        &nbsp;|&nbsp;
		        <span id="select-language" class="label label-success sl_but">
		        	<?= ucfirst($this->config->item('language')) ?>
		        </span>
		    </div>
		
		    <div id="footer-user-display-name" class="col-xs-12 col-sm-4">
		        <?= lang('hello') . ', ' . $user_display_name ?>!
		    </div>
		</div>
		<!-- End of Home Footer -->
		
		<script src="<?= asset_url('assets/js/admin.js', NULL, 'js') ?>"></script>
		<script src="<?= asset_url('assets/js/general_functions.js', NULL, 'js') ?>"></script>
	</body>
</html>
