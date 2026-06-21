-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: localhost    Database: crud_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'dee039f3-03c3-11f1-96fb-2c5629c978fd:1-678';

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_agregado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactanos`
--

DROP TABLE IF EXISTS `contactanos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactanos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `codigo_pais` varchar(20) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `comentarios` text,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactanos`
--

LOCK TABLES `contactanos` WRITE;
/*!40000 ALTER TABLE `contactanos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactanos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `descuento` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-19 20:22:12

SELECT id, nombre, precio FROM productos ORDER BY id;


USE crud_db;

-- ============================================================
-- Productos de GALERIA (data-id 1 a 12 en galeria.html)
-- ============================================================

INSERT INTO productos (id, nombre, precio, imagen_url, categoria, descuento) VALUES
(1,  'vela frutal frambuesa',    54900, '../ASSETS/IMAGENES/galeria/vela frutal 1.jpg',     'frutales',       NULL),
(2,  'vela frutal fresa',        61500, '../ASSETS/IMAGENES/galeria/vela frutal 2.jpg',     'frutales',       NULL),
(3,  'vela frutal naranja',      42000, '../ASSETS/IMAGENES/galeria/vela frutal 3.jpg',     'frutales',       NULL),
(4,  'vela nube cielo',          48000, '../ASSETS/IMAGENES/galeria/vela tematica 1.jpg',   'tematicas',      NULL),
(5,  'set velas tarot',          55000, '../ASSETS/IMAGENES/galeria/vela tematica 2.webp',  'tematicas',      NULL),
(6,  'vela acuática nube',       57500, '../ASSETS/IMAGENES/galeria/vela tematica 3.jpg',   'tematicas',      NULL),
(7,  'vela pide un deseo',       43000, '../ASSETS/IMAGENES/galeria/vela tematica 4.webp',  'personalizadas', NULL),
(8,  'vela cereal frutal',       29900, '../ASSETS/IMAGENES/galeria/vela tematica 5.jpg',   'personalizadas', NULL),
(9,  'set velas frutales mini',  41000, '../ASSETS/IMAGENES/galeria/vela frutal 4.jpg',     'frutales',       NULL),
(10, 'set velas frutales mini',  51000, '../ASSETS/IMAGENES/galeria/vela frutal 5.jpg',     'frutales',       NULL),
(11, 'set velas frutales mini',  51000, '../ASSETS/IMAGENES/galeria/vela frutal 6.jpg',     'frutales',       NULL),
(12, 'set velas frutales mini',  51000, '../ASSETS/IMAGENES/galeria/vela tematica 6.jpg',   'frutales',       NULL);


-- ============================================================
-- Productos de OFERTAS (data-id 13 a 18 en ofertas.html)
-- ============================================================

INSERT INTO productos (id, nombre, precio, imagen_url, categoria, descuento) VALUES
(13, 'velas aromáticas',             22500, '../ASSETS/IMAGENES/index/velas aromaticas.webp',          'aromaticas', 15.00),
(14, 'velas frutales pequeñas',      18900, '../ASSETS/IMAGENES/index/velas frutales pequeñas.jpg',    'aromaticas', 21.00),
(15, 'velas aromáticas en concreto', 27200, '../ASSETS/IMAGENES/index/velas en concreto verde.webp',   'concreto',   10.00),
(16, 'velas con temática lunar',     25000, '../ASSETS/IMAGENES/index/velas tematica lunar.jpg',       'lunar',      5.00),
(17, 'vela concreto redonda',        29000, '../ASSETS/IMAGENES/index/velas en concreto 2.jpg',        'concreto',   8.00),
(18, 'vela luna llena',              23500, '../ASSETS/IMAGENES/index/velas tematica lunar 2.jpg',     'lunar',      15.00);

SELECT id, nombre, precio FROM productos ORDER BY id;
