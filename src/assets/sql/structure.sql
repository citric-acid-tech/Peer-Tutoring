-- CREATE DATABASE  IF NOT EXISTS `cle` /*!40100 DEFAULT CHARACTER SET utf8 */;
-- USE `cle`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cle
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ea_admin_log`
--

DROP TABLE IF EXISTS `ea_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_users` int(11) NOT NULL,
  `operation` varchar(45) DEFAULT NULL,
  `input_json` text,
  `output_json` text,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_users_idx` (`id_users`),
  CONSTRAINT `fk_id_users` FOREIGN KEY (`id_users`) REFERENCES `ea_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_admin_log`
--

LOCK TABLES `ea_admin_log` WRITE;
/*!40000 ALTER TABLE `ea_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_appointments`
--

DROP TABLE IF EXISTS `ea_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_datetime` datetime DEFAULT NULL,
  `notes` text,
  `hash` text,
  `is_unavailable` tinyint(4) DEFAULT '0',
  `id_users_customer` int(11) DEFAULT NULL,
  `id_services` int(11) DEFAULT NULL,
  `id_google_calendar` text,
  `booking_status` int(11) DEFAULT '0',
  `feedback` text,
  `suggestion` text,
  `stars` int(11) DEFAULT '0',
  `description` text,
  `remark` varchar(64) DEFAULT NULL,
  `comment_or_suggestion` text,
  `attachment_url` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_users_customer` (`id_users_customer`),
  KEY `id_services` (`id_services`),
  CONSTRAINT `appointments_services` FOREIGN KEY (`id_services`) REFERENCES `ea_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointments_users_customer` FOREIGN KEY (`id_users_customer`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_appointments`
--

LOCK TABLES `ea_appointments` WRITE;
/*!40000 ALTER TABLE `ea_appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_buffer_failed_email`
--

DROP TABLE IF EXISTS `ea_buffer_failed_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_buffer_failed_email` (
  `timestamp` datetime NOT NULL,
  `email` varchar(45) NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `email_body` text,
  PRIMARY KEY (`timestamp`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_buffer_failed_email`
--

LOCK TABLES `ea_buffer_failed_email` WRITE;
/*!40000 ALTER TABLE `ea_buffer_failed_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_buffer_failed_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_buffer_tutor_assigned`
--

DROP TABLE IF EXISTS `ea_buffer_tutor_assigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_buffer_tutor_assigned` (
  `sid` varchar(63) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `sid_UNIQUE` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_buffer_tutor_assigned`
--

LOCK TABLES `ea_buffer_tutor_assigned` WRITE;
/*!40000 ALTER TABLE `ea_buffer_tutor_assigned` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_buffer_tutor_assigned` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_consents`
--

DROP TABLE IF EXISTS `ea_consents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_consents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `first_name` varchar(256) DEFAULT NULL,
  `last_name` varchar(256) DEFAULT NULL,
  `email` varchar(512) DEFAULT NULL,
  `ip` varchar(256) DEFAULT NULL,
  `type` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_consents`
--

LOCK TABLES `ea_consents` WRITE;
/*!40000 ALTER TABLE `ea_consents` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_consents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_migrations`
--

DROP TABLE IF EXISTS `ea_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_migrations` (
  `version` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_migrations`
--

LOCK TABLES `ea_migrations` WRITE;
/*!40000 ALTER TABLE `ea_migrations` DISABLE KEYS */;
INSERT INTO `ea_migrations` VALUES (55);
/*!40000 ALTER TABLE `ea_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_roles`
--

DROP TABLE IF EXISTS `ea_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `slug` varchar(256) DEFAULT NULL,
  `is_admin` tinyint(4) DEFAULT NULL,
  `appointments` int(11) DEFAULT NULL,
  `customers` int(11) DEFAULT NULL,
  `services` int(11) DEFAULT NULL,
  `users` int(11) DEFAULT NULL,
  `system_settings` int(11) DEFAULT NULL,
  `user_settings` int(11) DEFAULT NULL,
  `my_appointments` int(11) DEFAULT NULL,
  `available_appointments` int(11) DEFAULT NULL,
  `appointments_management` int(11) DEFAULT '0',
  `tutors_settings` int(11) DEFAULT '0',
  `services_config` int(11) DEFAULT '0',
  `service_types_config` int(11) DEFAULT '0',
  `tutors_config` int(11) DEFAULT '0',
  `admin_settings` int(11) DEFAULT '0',
  `admin_appointments_management` int(11) DEFAULT '0',
  `statistics` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_roles`
--

LOCK TABLES `ea_roles` WRITE;
/*!40000 ALTER TABLE `ea_roles` DISABLE KEYS */;
INSERT INTO `ea_roles` VALUES (1,'Administrator','admin',1,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15),(2,'Provider','provider',0,15,15,0,0,0,15,15,15,15,15,0,0,0,0,0,0),(3,'Customer','customer',0,0,0,0,0,0,0,15,15,0,0,0,0,0,0,0,0),(4,'Secretary','secretary',0,15,15,0,0,0,15,15,15,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `ea_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_secretaries_providers`
--

DROP TABLE IF EXISTS `ea_secretaries_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_secretaries_providers` (
  `id_users_secretary` int(11) NOT NULL,
  `id_users_provider` int(11) NOT NULL,
  PRIMARY KEY (`id_users_secretary`,`id_users_provider`),
  KEY `id_users_secretary` (`id_users_secretary`),
  KEY `id_users_provider` (`id_users_provider`),
  CONSTRAINT `secretaries_users_provider` FOREIGN KEY (`id_users_provider`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `secretaries_users_secretary` FOREIGN KEY (`id_users_secretary`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_secretaries_providers`
--

LOCK TABLES `ea_secretaries_providers` WRITE;
/*!40000 ALTER TABLE `ea_secretaries_providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_secretaries_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_service_categories`
--

DROP TABLE IF EXISTS `ea_service_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_service_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_service_categories`
--

LOCK TABLES `ea_service_categories` WRITE;
/*!40000 ALTER TABLE `ea_service_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_service_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_services`
--

DROP TABLE IF EXISTS `ea_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `description` text,
  `availabilities_type` varchar(32) DEFAULT 'flexible',
  `id_service_categories` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT '0',
  `appointments_number` int(11) DEFAULT '0',
  `start_datetime` datetime DEFAULT '1997-07-01 00:00:00',
  `end_datetime` datetime DEFAULT '1945-10-01 00:00:00',
  `id_users_provider` int(11) DEFAULT NULL,
  `address` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_service_categories` (`id_service_categories`),
  KEY `services_users_provider` (`id_users_provider`),
  CONSTRAINT `services_service_categories` FOREIGN KEY (`id_service_categories`) REFERENCES `ea_service_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `services_users_provider` FOREIGN KEY (`id_users_provider`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_services`
--

LOCK TABLES `ea_services` WRITE;
/*!40000 ALTER TABLE `ea_services` DISABLE KEYS */;
INSERT INTO `ea_services` VALUES (1,'Test Service',30,'This is a test service automatically inserted by the installer.','flexible',NULL,0,0,'1997-07-01 00:00:00','1945-10-01 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE `ea_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_services_providers`
--

DROP TABLE IF EXISTS `ea_services_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_services_providers` (
  `id_users` int(11) NOT NULL,
  `id_services` int(11) NOT NULL,
  PRIMARY KEY (`id_users`,`id_services`),
  KEY `id_services` (`id_services`),
  CONSTRAINT `services_providers_services` FOREIGN KEY (`id_services`) REFERENCES `ea_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `services_providers_users_provider` FOREIGN KEY (`id_users`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_services_providers`
--

LOCK TABLES `ea_services_providers` WRITE;
/*!40000 ALTER TABLE `ea_services_providers` DISABLE KEYS */;
INSERT INTO `ea_services_providers` VALUES (2,1);
/*!40000 ALTER TABLE `ea_services_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_settings`
--

DROP TABLE IF EXISTS `ea_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) DEFAULT NULL,
  `value` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_settings`
--

LOCK TABLES `ea_settings` WRITE;
/*!40000 ALTER TABLE `ea_settings` DISABLE KEYS */;
INSERT INTO `ea_settings` VALUES (1,'company_working_plan','{\"sunday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"monday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"tuesday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"wednesday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"thursday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"friday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"saturday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"11:20\",\"end\":\"11:30\"},{\"start\":\"14:30\",\"end\":\"15:00\"}]}}'),(2,'book_advance_timeout','30'),(3,'google_analytics_code',''),(4,'customer_notifications','1'),(5,'date_format','YMD'),(6,'time_format','regular'),(7,'require_captcha','0'),(8,'display_cookie_notice','0'),(9,'cookie_notice_content','Cookie notice content.'),(10,'display_terms_and_conditions','0'),(11,'terms_and_conditions_content','Terms and conditions content.'),(12,'display_privacy_policy','0'),(13,'privacy_policy_content','Privacy policy content.'),(14,'company_name','SUSTech'),(15,'company_email','kingsmanmikey@163.com'),(16,'company_link','cle.sustech.edu.cn'),(17,'upload_file_max_size(KB)','2048'),(18,'max_services_checking_ahead_day','7'),(19,'max_appointment_cancel_ahead_day','1'),(20,'semester_json','{\r\n                \"2019\":{\r\n                    \"Spring\":{\r\n                        \"first_Monday\":\"2019-02-18\",\r\n                        \"last_weeks\":\"15\"\r\n                    },\r\n                    \"Summer\":{\r\n                        \"first_Monday\":\"2019-06-24\",\r\n                        \"last_weeks\":\"6\"\r\n                    },\r\n                    \"Fall\":{\r\n                        \"first_Monday\":\"2019-08-05\",\r\n                        \"last_weeks\":\"17\"\r\n                    }\r\n                }\r\n            }'),(21,'flexible_column_label','flexible col'),(22,'ec_new_appoint_stu','{\"subject\":\"Successful appointment\",\"body\":\"You have booked an appointment $SERV_TYPE$ on $DATE$ at $ADDRESS$. Plz come by on time. And check the details on http:\\/\\/localhost.\"}'),(23,'ec_new_appoint_tut','{\"subject\":\"You have a new appointment.\",\"body\":\"Your service $SERV_TYPE$ on $DATE$ has been booked. Plz come by on time. And check the details on http:\\/\\/localhost.\"}'),(24,'ec_cancel_appoint_stu','{\"subject\":\"Sucessful cancellation\",\"body\":\"You have canceled an appointment $SERV_TYPE$ on $DATE$ at $ADDRESS$. \"}'),(25,'ec_cancel_appoint_tut','{\"subject\":\"One of your appointment was canceled\",\"body\":\"Your service $SERV_TYPE$ on $DATE$ has been canceled. There are still $LEFT$ in this service.\"}'),(26,'ec_survey_comple_tut','{\"subject\":\"A feedback of your service is received.\",\"body\":\"Your service $SERV_TYPE$ on $DATE$ has received a feedback. And check the details on http:\\/\\/localhost.\"}'),(27,'ec_comsug_comple_stu','{\"subject\":\"A feedback of your appointment is received.\",\"body\":\"Your appointment $SERV_TYPE$ on $DATE$ has received a feedback. And check the details on http:\\/\\/localhost.\"}'),(28,'ec_add_tutor_tut','{\"subject\":\"You are officially a tutor now.\",\"body\":\"Hi there! Congrates!! After our consideration. You are officially our tutor now!! And check the details on http:\\/\\/localhost\\/index.php\\/tutor.\"}'),(29,'ec_edit_service_tut','{\"subject\":\"You service has been edited by CLE.\",\"body\":\"Your service $SERV_TYPE$ on $DATE$ has been edited. And check the details on http:\\/\\/localhost.\"}'),(30,'ec_del_service_stu','{\"subject\":\"A service was cancelled\",\"body\":\"We are sorry to tell you that your appointment appointment $SERV_TYPE$ on $DATE$ is cancelled. And check the details on http:\\/\\/localhost.\"}'),(31,'enable_email_notification','1');
/*!40000 ALTER TABLE `ea_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_student_log`
--

DROP TABLE IF EXISTS `ea_student_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_student_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_users` int(11) NOT NULL,
  `operation` varchar(45) DEFAULT NULL,
  `input_json` text,
  `output_json` text,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_student_id_users_id` (`id_users`),
  CONSTRAINT `fk_student_id_users` FOREIGN KEY (`id_users`) REFERENCES `ea_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_student_log`
--

LOCK TABLES `ea_student_log` WRITE;
/*!40000 ALTER TABLE `ea_student_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_student_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_tutor_log`
--

DROP TABLE IF EXISTS `ea_tutor_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_tutor_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_users` int(11) NOT NULL,
  `operation` varchar(45) DEFAULT NULL,
  `input_json` text,
  `output_json` text,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tutor_id_users_id` (`id_users`),
  CONSTRAINT `fk_tutor_id_users` FOREIGN KEY (`id_users`) REFERENCES `ea_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_tutor_log`
--

LOCK TABLES `ea_tutor_log` WRITE;
/*!40000 ALTER TABLE `ea_tutor_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `ea_tutor_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_user_settings`
--

DROP TABLE IF EXISTS `ea_user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_user_settings` (
  `id_users` int(11) NOT NULL,
  `username` varchar(256) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `salt` varchar(512) DEFAULT NULL,
  `working_plan` text,
  `notifications` tinyint(4) DEFAULT '0',
  `google_sync` tinyint(4) DEFAULT '0',
  `google_token` text,
  `google_calendar` varchar(128) DEFAULT NULL,
  `sync_past_days` int(11) DEFAULT '5',
  `sync_future_days` int(11) DEFAULT '5',
  `calendar_view` varchar(32) DEFAULT 'default',
  PRIMARY KEY (`id_users`),
  CONSTRAINT `user_settings_users` FOREIGN KEY (`id_users`) REFERENCES `ea_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_user_settings`
--

LOCK TABLES `ea_user_settings` WRITE;
/*!40000 ALTER TABLE `ea_user_settings` DISABLE KEYS */;
INSERT INTO `ea_user_settings` VALUES (1,'cle','637d67309b4598cdc67f144ee47ae196b5e55f948a35f983f58e6a397768f16f','fc0d151088ea877dff83ab44484bfff5ff89eb00a2942cd9e372e91e388791cd',NULL,0,0,NULL,NULL,5,5,'default'),(2,'johndoe','929f3873ac9d99c61e8459896104539889044c8f8d7b1393e23f55dcb1b1cf9a','7f518a2f12ea1e79aa0b4df7396e5e022692ff86cae5f4da41bf30c440964e8b','{\"monday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"tuesday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"wednesday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"thursday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"friday\":{\"start\":\"09:00\",\"end\":\"18:00\",\"breaks\":[{\"start\":\"14:30\",\"end\":\"15:00\"}]},\"saturday\":null,\"sunday\":null}',0,0,NULL,NULL,5,5,'default');
/*!40000 ALTER TABLE `ea_user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ea_users`
--

DROP TABLE IF EXISTS `ea_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ea_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(256) DEFAULT NULL,
  `last_name` varchar(512) DEFAULT NULL,
  `email` varchar(512) DEFAULT NULL,
  `mobile_number` varchar(128) DEFAULT NULL,
  `phone_number` varchar(128) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `city` varchar(256) DEFAULT NULL,
  `state` varchar(128) DEFAULT NULL,
  `zip_code` varchar(64) DEFAULT NULL,
  `notes` text,
  `id_roles` int(11) NOT NULL,
  `personal_page` varchar(256) DEFAULT 'no_personal_page',
  `flexible_column` varchar(256) DEFAULT 'null_value',
  `introduction` text,
  `cas_hash_id` varchar(32) DEFAULT NULL,
  `cas_sid` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_roles` (`id_roles`),
  CONSTRAINT `users_roles` FOREIGN KEY (`id_roles`) REFERENCES `ea_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ea_users`
--

LOCK TABLES `ea_users` WRITE;
/*!40000 ALTER TABLE `ea_users` DISABLE KEYS */;
INSERT INTO `ea_users` VALUES (1,'Mike','Wang','11710403@mail.sustc.edu.cn',NULL,'1',NULL,NULL,NULL,NULL,NULL,1,'no_personal_page','null_value',NULL,NULL,NULL),(2,'John','Doe','john@doe.com',NULL,'0123456789',NULL,NULL,NULL,NULL,NULL,2,'no_personal_page','null_value',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ea_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-08 16:18:43
