<?php
/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2018, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

/**
 * Easy!Appointments Configuration File
 *
 * Set your installation BASE_URL * without the trailing slash * and the database
 * credentials in order to connect to the database. You can enable the DEBUG_MODE
 * while developing the application.
 *
 * Set the default language by changing the LANGUAGE constant. For a full list of
 * available languages look at the /application/config/config.php file.
 *
 * IMPORTANT:
 * If you are updating from version 1.0 you will have to create a new "config.php"
 * file because the old "configuration.php" is not used anymore.
 */
class Config {

    // ------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------

    const BASE_URL      = 'https://url-to-easyappointments-directory';
    const LANGUAGE      = 'english';
    const DEBUG_MODE    = FALSE;

    // ------------------------------------------------------------------------
    // DATABASE SETTINGS
    // ------------------------------------------------------------------------

    const DB_HOST       = '';
    const DB_NAME       = '';
    const DB_USERNAME   = '';
    const DB_PASSWORD   = '';

    // ------------------------------------------------------------------------
    // GOOGLE CALENDAR SYNC
    // ------------------------------------------------------------------------

    const GOOGLE_SYNC_FEATURE   = FALSE; // Enter TRUE or FALSE
    const GOOGLE_PRODUCT_NAME   = '';
    const GOOGLE_CLIENT_ID      = '';
    const GOOGLE_CLIENT_SECRET  = '';
    const GOOGLE_API_KEY        = '';

    // ------------------------------------------------------------------------
    // phpCAS SETTINGS
    // ------------------------------------------------------------------------

    const CAS_DEBUG = TRUE;
    const CAS_DISABLE_SERVER_VALIDATION = TRUE;
    const VENDOR_CAS_SOURCE = 'vendor/jasig/phpcas/source';

    ///////////////////////////////////////
    // Basic Config of the phpCAS client //
    ///////////////////////////////////////
    // Full Hostname of your CAS Server
    const CAS_HOST = 'cas.sustech.edu.cn';
    // Context of the CAS Server
    const CAS_CONTEXT = '/cas';
    // Port of your CAS server. Normally for a https server it's 443
    const CAS_PORT = 443;

    // ------------------------------------------------------------------------
    // SMTP Server SETTINGS
    // ------------------------------------------------------------------------

    const SMTP_HOST     = 'smtp.163.com';
    const SMTP_PORT     = 994;
    const SMTP_FROMNAME = 'mail|Citric-Acid';
    const SMTP_SMTPUSER = 'XXX@163.com';
    const SMTP_PASSWORD = 'Authorised password(smtp授权密码)';
    const SMTP_FROM     = 'XXX@163.com';
}

/* End of file config.php */
/* Location: ./config.php */
