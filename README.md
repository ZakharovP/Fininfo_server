18.03.2020
Сделано
1) В БД Mysql изменена таблица users, добавлены поля для имени, отчества, фамилии, а также поле IS_ADMIN
2) Добавлено соединение с БД Mysql и запросы к ней
3) Получение с данных с сайта вуза через API (заготовка для заполнения БД, если понадобится)
4) Заготовка для системы чатов, создан TCP сервер на Node.js, отправляет всем соединениям полученные данные

25.03.2020
Сделано
1) Получение и парсинг TCP байтов по разделителю
2) Определение типа сообщения (обычное текстовое сообщение или файл) по байту до разделителя
3) Сохранение сообщений в базе данных и отдельно полученных файлов в каталоге
4) Отправка при установлении TCP соединения истории сообщений
5) Добавлена возможность отправки статических файлов по HTTP

15.04.2020
Сделано
1) Добавлена таблица rooms в базе данных
2) Добавлен обработчик GET запросов на получение списка всех комнат
3) Добавлен обработчик POST запросов на создание новой комнаты

07.06.2020
Сделано
1) Добавлена загрузка документов
2) В базе данных в таблице messages добавлено поле для документа
3) Добавлено получение данных юзера по его Id и использование его имени и фамилии при отправке сообщений
4) Добавлены комментарии к коду