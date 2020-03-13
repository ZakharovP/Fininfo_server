-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Мар 12 2020 г., 15:42
-- Версия сервера: 10.1.36-MariaDB
-- Версия PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `Project`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Classes`
--

CREATE TABLE `Classes` (
  `ID_CLASS` int(11) NOT NULL,
  `ID_TEACHER` int(11) NOT NULL,
  `ID_SUBJECT` int(11) NOT NULL,
  `ID_GROUP` int(11) NOT NULL,
  `START_TIME` time NOT NULL,
  `END_TIME` time NOT NULL,
  `DAY_OF_WEEK` int(11) NOT NULL,
  `ODD_EVEN` int(11) NOT NULL,
  `LOCATION` varchar(40) NOT NULL,
  `TYPE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Classes`
--

INSERT INTO `Classes` (`ID_CLASS`, `ID_TEACHER`, `ID_SUBJECT`, `ID_GROUP`, `START_TIME`, `END_TIME`, `DAY_OF_WEEK`, `ODD_EVEN`, `LOCATION`, `TYPE`) VALUES
(1, 1, 1, 1, '10:10:00', '11:40:00', 1, 0, 'Щербаковская 38', 0),
(2, 2, 2, 1, '11:50:00', '13:20:00', 1, 0, 'Щербаковская 38', 1),
(3, 1, 1, 1, '14:00:00', '15:30:00', 1, 0, 'Щербаковская 38', 1),
(4, 2, 2, 1, '15:40:00', '17:10:00', 1, 0, 'Щербаковская 38', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `Groups`
--

CREATE TABLE `Groups` (
  `ID_GROUP` int(11) NOT NULL,
  `GROUP_NAME` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Groups`
--

INSERT INTO `Groups` (`ID_GROUP`, `GROUP_NAME`) VALUES
(1, 'ПИ3-2');

-- --------------------------------------------------------

--
-- Структура таблицы `Reviews`
--

CREATE TABLE `Reviews` (
  `ID_REVIEW` int(11) NOT NULL,
  `ID_TEACHER` int(11) NOT NULL,
  `REVIEW_TEXT` varchar(3000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

-- --------------------------------------------------------

--
-- Структура таблицы `Students`
--

CREATE TABLE `Students` (
  `ID_STUDENT` int(11) NOT NULL,
  `FIRST_NAME` varchar(20) NOT NULL,
  `SECOND_NAME` varchar(20) NOT NULL,
  `THIRD_NAME` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Students`
--

INSERT INTO `Students` (`ID_STUDENT`, `FIRST_NAME`, `SECOND_NAME`, `THIRD_NAME`) VALUES
(1, 'Александр', 'Тюрин', 'Владиславович'),
(2, 'Александр', 'Налетов', 'Денисович');

-- --------------------------------------------------------

--
-- Структура таблицы `Students_groups`
--

CREATE TABLE `Students_groups` (
  `ID_STUDENT` int(11) NOT NULL,
  `ID_GROUP` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Students_groups`
--

INSERT INTO `Students_groups` (`ID_STUDENT`, `ID_GROUP`) VALUES
(1, 1),
(2, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Subjects`
--

CREATE TABLE `Subjects` (
  `ID_SUBJECT` int(11) NOT NULL,
  `SUBJECT_NAME` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Subjects`
--

INSERT INTO `Subjects` (`ID_SUBJECT`, `SUBJECT_NAME`) VALUES
(1, 'Математические методы принятия решений'),
(2, 'Технологии разработки web приложений'),
(3, 'Военная подготовка'),
(5, 'Технологии разработки приложений для мобильных устройств'),
(6, 'Иностранный язык в профессиональной сфере');

-- --------------------------------------------------------

--
-- Структура таблицы `Teachers`
--

CREATE TABLE `Teachers` (
  `ID_TEACHER` int(11) NOT NULL,
  `FIRST_NAME` varchar(20) NOT NULL,
  `SECOND_NAME` varchar(20) NOT NULL,
  `THIRD_NAME` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Дамп данных таблицы `Teachers`
--

INSERT INTO `Teachers` (`ID_TEACHER`, `FIRST_NAME`, `SECOND_NAME`, `THIRD_NAME`) VALUES
(1, 'Георгий', 'Моисеев ', 'Викторович'),
(2, 'Лев', 'Чернышов', 'Николаевич'),
(3, 'Юрий ', 'Литвин', 'Иванович'),
(4, 'Даниил', 'Милованов', 'Михайлович'),
(5, 'Анастасия', 'Карпова', 'Васильевна');

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `LOGIN` varchar(40) NOT NULL,
  `PASSWORD` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ID_CLASS`),
  ADD KEY `ID_GROUP` (`ID_GROUP`),
  ADD KEY `ID_TEACHER` (`ID_TEACHER`),
  ADD KEY `ID_SUBJECT` (`ID_SUBJECT`);

--
-- Индексы таблицы `Groups`
--
ALTER TABLE `Groups`
  ADD PRIMARY KEY (`ID_GROUP`);

--
-- Индексы таблицы `Reviews`
--
ALTER TABLE `Reviews`
  ADD PRIMARY KEY (`ID_REVIEW`),
  ADD KEY `ID_TEACHER` (`ID_TEACHER`);

--
-- Индексы таблицы `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`ID_STUDENT`);

--
-- Индексы таблицы `Students_groups`
--
ALTER TABLE `Students_groups`
  ADD KEY `ID_GROUP` (`ID_GROUP`),
  ADD KEY `ID_STUDENT` (`ID_STUDENT`);

--
-- Индексы таблицы `Subjects`
--
ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`ID_SUBJECT`);

--
-- Индексы таблицы `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`ID_TEACHER`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Classes`
--
ALTER TABLE `Classes`
  MODIFY `ID_CLASS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Groups`
--
ALTER TABLE `Groups`
  MODIFY `ID_GROUP` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `Reviews`
--
ALTER TABLE `Reviews`
  MODIFY `ID_REVIEW` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Students`
--
ALTER TABLE `Students`
  MODIFY `ID_STUDENT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `Subjects`
--
ALTER TABLE `Subjects`
  MODIFY `ID_SUBJECT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `Teachers`
--
ALTER TABLE `Teachers`
  MODIFY `ID_TEACHER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Classes`
--
ALTER TABLE `Classes`
  ADD CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`ID_GROUP`) REFERENCES `Groups` (`ID_GROUP`),
  ADD CONSTRAINT `Classes_ibfk_2` FOREIGN KEY (`ID_TEACHER`) REFERENCES `Teachers` (`ID_TEACHER`),
  ADD CONSTRAINT `Classes_ibfk_3` FOREIGN KEY (`ID_SUBJECT`) REFERENCES `Subjects` (`ID_SUBJECT`);

--
-- Ограничения внешнего ключа таблицы `Reviews`
--
ALTER TABLE `Reviews`
  ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`ID_TEACHER`) REFERENCES `Teachers` (`ID_TEACHER`);

--
-- Ограничения внешнего ключа таблицы `Students_groups`
--
ALTER TABLE `Students_groups`
  ADD CONSTRAINT `Students_groups_ibfk_1` FOREIGN KEY (`ID_GROUP`) REFERENCES `Groups` (`ID_GROUP`),
  ADD CONSTRAINT `Students_groups_ibfk_2` FOREIGN KEY (`ID_STUDENT`) REFERENCES `Students` (`ID_STUDENT`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
