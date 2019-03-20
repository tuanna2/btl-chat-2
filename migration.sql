-- up
CREATE DATABASE `chat` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `chat`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(15) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);
