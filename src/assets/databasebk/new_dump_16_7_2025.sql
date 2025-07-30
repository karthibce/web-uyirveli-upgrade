SET foreign_key_checks = 0;
-- CREATE DATABASE uyirveli_db;

use uyirveli_db;



DROP TABLE IF EXISTS `tbl_activity_members`;
CREATE TABLE `tbl_activity_members` (
  `AMM_Id` int(11) NOT NULL AUTO_INCREMENT,
  `AMM_ACT_ActivityId` int(11) NOT NULL,
  `AMM_MEM_MemberId` int(11) NOT NULL,
  `AMM_WorkingHours` decimal(5,2) NOT NULL,
  `AMM_PaymentStatus` enum('Pending','Paid','Partial') DEFAULT 'Pending',
  `AMM_MemberComments` text,
  `AMM_CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `AMM_CreatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`AMM_Id`),
  KEY `tbl_activity_members_ibfk_1` (`AMM_ACT_ActivityId`),
  KEY `tbl_activity_members_ibfk_2` (`AMM_MEM_MemberId`),
  CONSTRAINT `tbl_activity_members_ibfk_1` FOREIGN KEY (`AMM_ACT_ActivityId`) REFERENCES `tbl_work_activities` (`ACT_ActivityId`),
  CONSTRAINT `tbl_activity_members_ibfk_2` FOREIGN KEY (`AMM_MEM_MemberId`) REFERENCES `tbl_members` (`MEM_MemberId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

INSERT INTO `tbl_activity_members` VALUES (1,1,1,5.00,'Pending',NULL,'2025-07-12 00:13:01',NULL),(2,1,2,5.00,'Pending',NULL,'2025-07-12 00:13:01',NULL),(3,2,3,4.00,'Pending',NULL,'2025-07-12 00:13:01',NULL),(4,2,1,4.00,'Pending',NULL,'2025-07-12 00:13:01',NULL),(5,2,2,4.00,'Pending',NULL,'2025-07-12 00:13:01',NULL);


DROP TABLE IF EXISTS `tbl_article_categories`;
CREATE TABLE `tbl_article_categories` (
  `ARC_ArticleID` int(11) NOT NULL,
  `ARC_CAT_CategoryID` int(11) NOT NULL,
  `ARC_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `ARC_CreatedBy` int(11) DEFAULT NULL,
  `ARC_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ARC_LastModifiedBy` int(11) DEFAULT NULL,
  `ARC_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ARC_ArticleID`,`ARC_CAT_CategoryID`),
  KEY `tbl_article_categories_ibfk_2` (`ARC_CAT_CategoryID`),
  CONSTRAINT `tbl_article_categories_ibfk_1` FOREIGN KEY (`ARC_ArticleID`) REFERENCES `tbl_articles` (`ART_ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `tbl_article_categories_ibfk_2` FOREIGN KEY (`ARC_CAT_CategoryID`) REFERENCES `tbl_categories` (`CAT_CategoryID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_article_categories`
--

 
--
-- Table structure for table `tbl_article_seo`
--

DROP TABLE IF EXISTS `tbl_article_seo`;
CREATE TABLE `tbl_article_seo` (
  `SEO_ArticleID` int(11) NOT NULL,
  `SEO_MetaTitle` varchar(255) DEFAULT NULL,
  `SEO_MetaDescription` varchar(500) DEFAULT NULL,
  `SEO_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `SEO_CreatedBy` int(11) DEFAULT NULL,
  `SEO_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SEO_LastModifiedBy` int(11) DEFAULT NULL,
  `SEO_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SEO_ArticleID`),
  CONSTRAINT `tbl_article_seo_ibfk_1` FOREIGN KEY (`SEO_ArticleID`) REFERENCES `tbl_articles` (`ART_ArticleID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

 
DROP TABLE IF EXISTS `tbl_article_tags`;
CREATE TABLE `tbl_article_tags` (
  `ATG_ArticleID` int(11) NOT NULL,
  `ATG_TAG_TagID` int(11) NOT NULL,
  `ATG_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `ATG_CreatedBy` int(11) DEFAULT NULL,
  `ATG_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ATG_LastModifiedBy` int(11) DEFAULT NULL,
  `ATG_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ATG_ArticleID`,`ATG_TAG_TagID`),
  KEY `tbl_article_tags_ibfk_2` (`ATG_TAG_TagID`),
  CONSTRAINT `tbl_article_tags_ibfk_1` FOREIGN KEY (`ATG_ArticleID`) REFERENCES `tbl_articles` (`ART_ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `tbl_article_tags_ibfk_2` FOREIGN KEY (`ATG_TAG_TagID`) REFERENCES `tbl_tags` (`TAG_TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

   

DROP TABLE IF EXISTS `tbl_article_views`;
CREATE TABLE `tbl_article_views` (
  `VW_ArticleID` int(11) NOT NULL,
  `VW_Views` bigint(20) unsigned DEFAULT '0',
  `VW_Likes` bigint(20) unsigned DEFAULT '0',
  `VW_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `VW_CreatedBy` int(11) DEFAULT NULL,
  `VW_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `VW_LastModifiedBy` int(11) DEFAULT NULL,
  `VW_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`VW_ArticleID`),
  CONSTRAINT `tbl_article_views_ibfk_1` FOREIGN KEY (`VW_ArticleID`) REFERENCES `tbl_articles` (`ART_ArticleID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

 
DROP TABLE IF EXISTS `tbl_articles`;
CREATE TABLE `tbl_articles` (
  `ART_ArticleID` int(11) NOT NULL AUTO_INCREMENT,
  `ART_AuthorID` int(11) NOT NULL,
  `ART_Title` varchar(255) NOT NULL,
  `ART_Slug` varchar(255) NOT NULL,
  `ART_Content` mediumtext NOT NULL,
  `ART_Status` enum('draft','published','archived') DEFAULT 'draft',
  `ART_RecordStatus` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `ART_PublishedAt` datetime DEFAULT NULL,
  `ART_CreatedBy` int(11) DEFAULT NULL,
  `ART_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ART_LastModifiedBy` int(11) DEFAULT NULL,
  `ART_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ART_ArticleID`),
  UNIQUE KEY `ART_Slug` (`ART_Slug`),
  KEY `ART_AuthorID` (`ART_AuthorID`),
  CONSTRAINT `tbl_articles_ibfk_1` FOREIGN KEY (`ART_AuthorID`) REFERENCES `tbl_users` (`USR_UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
 --

DROP TABLE IF EXISTS `tbl_categories`;
CREATE TABLE `tbl_categories` (
  `CAT_CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CAT_Name` varchar(100) NOT NULL,
  `CAT_Slug` varchar(100) NOT NULL,
  `CAT_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `CAT_CreatedBy` int(11) DEFAULT NULL,
  `CAT_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CAT_LastModifiedBy` int(11) DEFAULT NULL,
  `CAT_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CAT_CategoryID`),
  UNIQUE KEY `CAT_Name` (`CAT_Name`),
  UNIQUE KEY `CAT_Slug` (`CAT_Slug`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
   

DROP TABLE IF EXISTS `tbl_comments`;
CREATE TABLE `tbl_comments` (
  `COM_CommentID` int(11) NOT NULL AUTO_INCREMENT,
  `COM_ART_ArticleID` int(11) NOT NULL,
  `COM_UserID` int(11) DEFAULT NULL,
  `COM_Comment` text NOT NULL,
  `COM_Status` enum('pending','approved','rejected') DEFAULT 'pending',
  `COM_RecordStatus` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `COM_CreatedBy` int(11) DEFAULT NULL,
  `COM_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `COM_LastModifiedBy` int(11) DEFAULT NULL,
  `COM_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`COM_CommentID`),
  KEY `COM_UserID` (`COM_UserID`),
  KEY `tbl_comments_ibfk_1` (`COM_ART_ArticleID`),
  CONSTRAINT `tbl_comments_ibfk_1` FOREIGN KEY (`COM_ART_ArticleID`) REFERENCES `tbl_articles` (`ART_ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `tbl_comments_ibfk_2` FOREIGN KEY (`COM_UserID`) REFERENCES `tbl_users` (`USR_UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
DROP TABLE IF EXISTS `tbl_customer_info`;
CREATE TABLE `tbl_customer_info` (
  `CUS_CustomerID` int(11) NOT NULL AUTO_INCREMENT,
  `CUS_CustomerName` varchar(255) DEFAULT NULL,
  `CUS_PhoneNumber` varchar(20) DEFAULT NULL,
  `CUS_Village` varchar(255) DEFAULT NULL,
  `CUS_Block` varchar(255) DEFAULT NULL,
  `CUS_District` varchar(255) DEFAULT NULL,
  `CUS_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `CUS_CreatedBy` int(11) DEFAULT NULL,
  `CUS_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CUS_LastModifiedBy` int(11) DEFAULT NULL,
  `CUS_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CUS_CustomerID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO `tbl_customer_info` VALUES (1,'gopalan','9488087588','melavalavu','kottampatti','madurai','Active',NULL,'2025-07-11 17:47:50',NULL,'2025-07-11 17:47:50'),(2,'gopalan mani','9884625588','melavalavu kailampatti road','kottampatti','madurai','Active',1,'2025-07-11 17:55:36',NULL,'2025-07-11 18:08:10');
 
DROP TABLE IF EXISTS `tbl_media`;
CREATE TABLE `tbl_media` (
  `MED_MediaID` int(11) NOT NULL AUTO_INCREMENT,
  `MED_SourceType` enum('article','product') COLLATE utf8mb4_unicode_ci NOT NULL,
  `MED_SourceID` int(11) NOT NULL,
  `MED_FilePath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MED_Type` enum('image','video','audio') COLLATE utf8mb4_unicode_ci DEFAULT 'image',
  `MED_Caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MED_Status` enum('Active','In-Active','Deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `MED_CreatedBy` int(11) DEFAULT NULL,
  `MED_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `MED_LastModifiedBy` int(11) DEFAULT NULL,
  `MED_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MED_MediaID`),
  KEY `idx_media_source` (`MED_SourceType`,`MED_SourceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `tbl_media_thumbnails`;
CREATE TABLE `tbl_media_thumbnails` (
  `THM_ThumbnailID` int(11) NOT NULL AUTO_INCREMENT,
  `THM_MED_MediaID` int(11) NOT NULL,
  `THM_FilePath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `THM_Caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `THM_Status` enum('Active','In-Active','Deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `THM_CreatedBy` int(11) DEFAULT NULL,
  `THM_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `THM_LastModifiedBy` int(11) DEFAULT NULL,
  `THM_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`THM_ThumbnailID`),
  KEY `idx_thm_mediaid` (`THM_MED_MediaID`),
  CONSTRAINT `fk_thm_media` FOREIGN KEY (`THM_MED_MediaID`) REFERENCES `tbl_media` (`MED_MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
  
DROP TABLE IF EXISTS `tbl_members`;
CREATE TABLE `tbl_members` (
  `MEM_MemberId` int(11) NOT NULL AUTO_INCREMENT,
  `MEM_FullName` varchar(100) NOT NULL,
  `MEM_MobileNumber` varchar(15) DEFAULT NULL,
  `MEM_CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `MEM_CreatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`MEM_MemberId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO `tbl_members` VALUES (1,'Bavani',NULL,'2025-07-12 00:07:56',1),(2,'Jeyasri',NULL,'2025-07-12 00:07:56',1),(3,'Jothi',NULL,'2025-07-12 00:07:56',1),(4,'Nathiya',NULL,'2025-07-12 00:07:56',1);
 


DROP TABLE IF EXISTS `tbl_order_info`;
CREATE TABLE `tbl_order_info` (
  `ORD_OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `ORD_CUS_CustomerID` int(11) DEFAULT NULL,
  `ORD_PhoneNumber` varchar(20) DEFAULT NULL,
  `ORD_ShortDescription` varchar(500) DEFAULT NULL,
  `ORD_AdminComments` varchar(500) DEFAULT NULL,
  `ORD_OrderStatus` enum('pending','processing','placedorder') DEFAULT 'pending',
  `ORD_OrderDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ORD_OrderAmount` decimal(10,2) DEFAULT '0.00',
  `ORD_Discount` decimal(10,2) DEFAULT '0.00',
  `ORD_Total` decimal(10,2) DEFAULT '0.00',
  `ORD_DeliveryStatus` enum('Pending','Delivered') DEFAULT 'Pending',
  `ORD_PaymentStatus` enum('Pending','Partial','Paid') DEFAULT 'Pending',
  `ORD_DeliveryNotes` varchar(1000) DEFAULT NULL,
  `ORD_CreatedBy` int(11) DEFAULT NULL,
  `ORD_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ORD_LastModifiedBy` int(11) DEFAULT NULL,
  `ORD_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ORD_OrderID`),
  KEY `tbl_order_info_ibfk_1` (`ORD_CUS_CustomerID`),
  CONSTRAINT `tbl_order_info_ibfk_1` FOREIGN KEY (`ORD_CUS_CustomerID`) REFERENCES `tbl_customer_info` (`CUS_CustomerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `tbl_order_payments`;
CREATE TABLE `tbl_order_payments` (
  `ORP_PaymentId` int(11) NOT NULL AUTO_INCREMENT,
  `ORP_ORD_OrderID` int(11) NOT NULL,
  `ORP_PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ORP_PaymentAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `ORP_PaymentMode` varchar(50) DEFAULT NULL,
  `ORP_ReferenceNumber` varchar(100) DEFAULT NULL,
  `ORP_Remarks` varchar(500) DEFAULT NULL,
  `ORP_CreatedBy` int(11) DEFAULT NULL,
  `ORP_CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ORP_PaymentId`),
  KEY `tbl_order_payments_ibfk_1` (`ORP_ORD_OrderID`),
  CONSTRAINT `tbl_order_payments_ibfk_1` FOREIGN KEY (`ORP_ORD_OrderID`) REFERENCES `tbl_order_info` (`ORD_OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


 
DROP TABLE IF EXISTS `tbl_product_category`;
CREATE TABLE `tbl_product_category` (
  `PRC_ProductCategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `PRC_CategoryName` varchar(255) NOT NULL,
  `PRC_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `PRC_CreatedBy` int(11) DEFAULT NULL,
  `PRC_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PRC_LastModifiedBy` int(11) DEFAULT NULL,
  `PRC_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PRC_ProductCategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `tbl_product_category` VALUES (1,'Bio Fertilizer','Active',NULL,'2025-07-09 13:35:33',NULL,'2025-07-09 13:35:33'),(2,'Organic Inputs','Active',NULL,'2025-07-09 13:37:55',NULL,'2025-07-09 13:37:55'),(3,'Treditional Rice','Active',NULL,'2025-07-09 13:37:55',NULL,'2025-07-09 13:37:55');


DROP TABLE IF EXISTS `tbl_products`;
CREATE TABLE `tbl_products` (
  `PRD_ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `PRD_ProductName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PRD_ProductCode` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PRD_ShortDesc` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PRD_LongDesc` mediumtext COLLATE utf8mb4_unicode_ci,
  `PRD_InStock` int(11) DEFAULT '0',
  `PRD_PRC_ProductCategoryID` int(11) DEFAULT NULL,
  `PRD_Status` enum('Active','In-Active','Deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `PRD_CreatedBy` int(11) DEFAULT NULL,
  `PRD_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PRD_LastModifiedBy` int(11) DEFAULT NULL,
  `PRD_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PRD_ProductID`),
  KEY `tbl_products_ibfk_1` (`PRD_PRC_ProductCategoryID`),
  CONSTRAINT `tbl_products_ibfk_1` FOREIGN KEY (`PRD_PRC_ProductCategoryID`) REFERENCES `tbl_product_category` (`PRC_ProductCategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `tbl_products` VALUES (1,'தில்லைநாயகம் பச்சை','T1',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 13:50:38',NULL,'2025-07-09 13:50:38'),(2,'தில்லைநாயகம் புழுங்கல்','T2',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 13:50:38',NULL,'2025-07-09 13:50:38'),(3,'தில்லைநாயகம் கைக்குத்தல்','T3',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 13:50:38',NULL,'2025-07-09 13:50:38'),(4,'தில்லைநாயகம் அவல்','T4',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 13:50:38',NULL,'2025-07-09 13:50:38'),(5,'அசோஸ்பைரில்லம் ','AZ',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:01:08',NULL,'2025-07-09 14:01:08'),(6,'பாஸ்போபாக்டீரியா ','PB',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:01:08',NULL,'2025-07-09 14:01:08'),(7,'பொட்டாஷ் பாக்டீரியா','PZB',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:01:08',NULL,'2025-07-09 14:01:08'),(8,'பஞ்சகவியா ','PY',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:04:22',NULL,'2025-07-09 14:04:22'),(9,'மீன் அமிலம்','MA',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:04:22',NULL,'2025-07-09 14:04:22'),(10,'ஹுமிக் அமிலம் ','HA',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:04:22',NULL,'2025-07-09 14:04:22'),(11,'புண்ணாக்கு கரைசல் ','KTEP',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:04:22',NULL,'2025-07-09 14:04:22'),(12,'டிரைகோடெர்மா விரிடி ','TV',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:06:48',NULL,'2025-07-09 14:06:48'),(13,'பஸ்சிலேஸ் சப்டில்லஸ் ','BS',NULL,NULL,0,NULL,'Active',NULL,'2025-07-09 14:06:48',NULL,'2025-07-09 14:06:48');


DROP TABLE IF EXISTS `tbl_reviews_rating`;
CREATE TABLE `tbl_reviews_rating` (
  `REV_ReviewID` int(11) NOT NULL AUTO_INCREMENT,
  `REV_PRD_ProductID` int(11) NOT NULL,
  `REV_Reviews` text,
  `REV_Rating` int(11) DEFAULT NULL,
  `REV_ReviewerName` varchar(255) DEFAULT NULL,
  `REV_ReviewerEmail` varchar(255) DEFAULT NULL,
  `REV_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `REV_CreatedBy` int(11) DEFAULT NULL,
  `REV_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `REV_LastModifiedBy` int(11) DEFAULT NULL,
  `REV_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`REV_ReviewID`),
  KEY `tbl_reviews_rating_ibfk_1` (`REV_PRD_ProductID`),
  CONSTRAINT `tbl_reviews_rating_ibfk_1` FOREIGN KEY (`REV_PRD_ProductID`) REFERENCES `tbl_products` (`PRD_ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `tbl_tags`;
CREATE TABLE `tbl_tags` (
  `TAG_TagID` int(11) NOT NULL AUTO_INCREMENT,
  `TAG_Name` varchar(50) NOT NULL,
  `TAG_Slug` varchar(50) NOT NULL,
  `TAG_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `TAG_CreatedBy` int(11) DEFAULT NULL,
  `TAG_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TAG_LastModifiedBy` int(11) DEFAULT NULL,
  `TAG_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TAG_TagID`),
  UNIQUE KEY `TAG_Name` (`TAG_Name`),
  UNIQUE KEY `TAG_Slug` (`TAG_Slug`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

 
DROP TABLE IF EXISTS `tbl_task_activities`;
CREATE TABLE `tbl_task_activities` (
  `TSA_ActivityId` int(11) NOT NULL AUTO_INCREMENT,
  `TSA_TSK_TaskId` int(11) NOT NULL,
  `TSA_ActionByMemberId` int(11) DEFAULT NULL,
  `TSA_ActivityDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `TSA_ActivitySummary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `TSA_Status` enum('Active','In-Active','Deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `TSA_CreatedBy` int(11) DEFAULT NULL,
  `TSA_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TSA_LastModifiedBy` int(11) DEFAULT NULL,
  `TSA_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TSA_ActivityId`),
  KEY `idx_tsa_taskid` (`TSA_TSK_TaskId`),
  CONSTRAINT `fk_tsa_task` FOREIGN KEY (`TSA_TSK_TaskId`) REFERENCES `tbl_tasks` (`TSK_TaskId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
DROP TABLE IF EXISTS `tbl_tasks`;
CREATE TABLE `tbl_tasks` (
  `TSK_TaskId` int(11) NOT NULL AUTO_INCREMENT,
  `TSK_TaskName` varchar(255) NOT NULL,
  `TSK_TaskDescription` text,
  `TSK_AssignedToMemberId` int(11) DEFAULT NULL,
  `TSK_TaskStatus` enum('Pending','In Progress','Completed','Cancelled') DEFAULT 'Pending',
  `TSK_ExpectedCompletionDate` date DEFAULT NULL,
  `TSK_ActualCompletionDate` date DEFAULT NULL,
  `TSK_CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `TSK_CreatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`TSK_TaskId`),
  KEY `TSK_AssignedToMemberId` (`TSK_AssignedToMemberId`),
  CONSTRAINT `tbl_tasks_ibfk_1` FOREIGN KEY (`TSK_AssignedToMemberId`) REFERENCES `tbl_members` (`MEM_MemberId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


INSERT INTO `tbl_tasks` VALUES (1,'followup MABIF activities','Regarding grant need to followup',2,'Pending','2025-07-20',NULL,'2025-07-13 04:29:33',1),(2,'followup notice changes','need to update the notice with latest product',2,'Pending','2025-07-20',NULL,'2025-07-13 04:30:27',1);


DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE `tbl_users` (
  `USR_UserID` int(11) NOT NULL AUTO_INCREMENT,
  `USR_Username` varchar(100) NOT NULL,
  `USR_Email` varchar(255) NOT NULL,
  `USR_PasswordHash` varchar(255) NOT NULL,
  `USR_Role` enum('author','reader','admin') DEFAULT 'reader',
  `USR_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `USR_CreatedBy` int(11) DEFAULT NULL,
  `USR_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `USR_LastModifiedBy` int(11) DEFAULT NULL,
  `USR_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USR_UserID`),
  UNIQUE KEY `USR_Username` (`USR_Username`),
  UNIQUE KEY `USR_Email` (`USR_Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
 
 
DROP TABLE IF EXISTS `tbl_work_activities`;
CREATE TABLE `tbl_work_activities` (
  `ACT_ActivityId` int(11) NOT NULL AUTO_INCREMENT,
  `ACT_ActivityDate` date NOT NULL,
  `ACT_WorkCategory` enum('Bio Fertilizer','Organic Inputs','Traditional Raice') NOT NULL,
  `ACT_Description` text,
  `ACT_NumberOfMembers` int(11) DEFAULT '0',
  `ACT_ProductionInfo` text,
  `ACT_VerifiedStatus` enum('Pending','Verified','Rejected') DEFAULT 'Pending',
  `ACT_PaymentStatus` enum('Pending','Paid','Partial') DEFAULT 'Pending',
  `ACT_PaymentPerHead` decimal(10,2) DEFAULT '0.00',
  `ACT_OtherExpenses` decimal(10,2) DEFAULT '0.00',
  `ACT_MemberComments` text,
  `ACT_CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ACT_CreatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`ACT_ActivityId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO `tbl_work_activities` VALUES (1,'2025-07-01','Bio Fertilizer','Virid making & packing',2,NULL,'Pending','Pending',0.00,0.00,NULL,'2025-07-12 00:10:14',NULL),(2,'2025-07-02','Organic Inputs',NULL,3,NULL,'Pending','Pending',0.00,0.00,NULL,'2025-07-12 00:11:41',NULL);


DROP TABLE IF EXISTS `tbl_order_items`;
CREATE TABLE `tbl_order_items` (
  `OIT_OrderItemID` int(11) NOT NULL AUTO_INCREMENT,
  `OIT_ORD_OrderID` int(11) DEFAULT NULL,
  `OIT_PRD_ProductID` int(11) DEFAULT NULL,
  `OIT_Quantity` int(11) DEFAULT '1',
  `OIT_Price` decimal(10,2) DEFAULT '0.00',
  `OIT_ItemAmount` decimal(10,2) DEFAULT '0.00',
  `OIT_Discount` decimal(10,2) DEFAULT '0.00',
  `OIT_TotalAmount` decimal(10,2) DEFAULT '0.00',
  `OIT_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `OIT_CreatedBy` int(11) DEFAULT NULL,
  `OIT_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `OIT_LastModifiedBy` int(11) DEFAULT NULL,
  `OIT_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`OIT_OrderItemID`),
  KEY `tbl_order_items_ibfk_1` (`OIT_ORD_OrderID`),
  KEY `tbl_order_items_ibfk_2` (`OIT_PRD_ProductID`),
  CONSTRAINT `tbl_order_items_ibfk_1` FOREIGN KEY (`OIT_ORD_OrderID`) REFERENCES `tbl_order_info` (`ORD_OrderID`),
  CONSTRAINT `tbl_order_items_ibfk_2` FOREIGN KEY (`OIT_PRD_ProductID`) REFERENCES `tbl_products` (`PRD_ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
 
DROP TABLE IF EXISTS `tbl_price_info`;
CREATE TABLE `tbl_price_info` (
  `PRI_PriceInfoID` int(11) NOT NULL AUTO_INCREMENT,
  `PRI_PRD_ProductID` int(11) NOT NULL,
  `PRI_Unit` varchar(50) DEFAULT NULL,
  `PRI_UnitPrice` decimal(10,2) DEFAULT '0.00',
  `PRI_IsDefault` tinyint(1) DEFAULT '0',
  `PRI_Status` enum('Active','In-Active','Deleted') DEFAULT 'Active',
  `PRI_CreatedBy` int(11) DEFAULT NULL,
  `PRI_CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PRI_LastModifiedBy` int(11) DEFAULT NULL,
  `PRI_LastModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PRI_PriceInfoID`),
  KEY `tbl_price_info_ibfk_1` (`PRI_PRD_ProductID`),
  CONSTRAINT `tbl_price_info_ibfk_1` FOREIGN KEY (`PRI_PRD_ProductID`) REFERENCES `tbl_products` (`PRD_ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 