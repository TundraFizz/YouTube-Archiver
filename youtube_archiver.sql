-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2018 at 10:55 PM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `youtube_archiver`
--

-- --------------------------------------------------------

--
-- Table structure for table `library`
--

CREATE TABLE `library` (
  `id` int(11) NOT NULL,
  `youtube_id` varchar(100) COLLATE utf32_bin NOT NULL,
  `title` varchar(100) COLLATE utf32_bin NOT NULL,
  `duration` int(11) NOT NULL,
  `path_image` varchar(100) COLLATE utf32_bin NOT NULL,
  `path_video` varchar(100) COLLATE utf32_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_bin;

--
-- Dumping data for table `library`
--

INSERT INTO `library` (`id`, `youtube_id`, `title`, `duration`, `path_image`, `path_video`) VALUES
(5, 'TEMDcuoCPvI', 'Pokemon: Destiny Deoxys - This Side of Paradise (Lyrics in Description)', 182, '*/*.jpg', '*/*.mp4'),
(6, 'Xb8XnuWx9Zw', '\"Together\" ENGLISH DUB COVER ft. roux - from Pokémon Diamond and Pearl (Opening 1)', 189, '*/*.jpg', '*/*.mp4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `library`
--
ALTER TABLE `library`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `library`
--
ALTER TABLE `library`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
