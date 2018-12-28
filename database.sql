SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `library` (
  `id` int(11) NOT NULL,
  `youtubeId` varchar(20) COLLATE utf16_bin NOT NULL,
  `title` varchar(200) COLLATE utf16_bin NOT NULL,
  `duration` int(11) NOT NULL,
  `pathImage` varchar(200) COLLATE utf16_bin NOT NULL,
  `pathVideo` varchar(200) COLLATE utf16_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

ALTER TABLE `library`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `library`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
