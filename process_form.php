<?php
	$logFile = 'log.txt'; 

	// Проверяем, была ли отправлена форма
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {

		// Получаем данные из формы
		$name = trim($_POST['name']);
		$companySite = trim($_POST['company-site']);
		$phone = trim($_POST['phone']);
		$agreement = isset($_POST['agreement']);

		// Проверка на пустые значения
		if (empty($name) || empty($companySite) || empty($phone) || !$agreement) {
			die('Пожалуйста, заполните все поля.');
		}

		// если номер телефона начинается с 8, уменьшаем длину номера на единицу (17)
		// (потому что если номер начинается с 7, то маска подставляет +)
		$phoneMaxLength = (strpos($phone, '8') === 0) ? 17 : 18;

		if (strlen($phone) < $phoneMaxLength) {
			die('Номер телефона должен содержать 11 цифр');
		}

		// формируем строку записи
		$logEntry = "Дата: " . date('Y-m-d H:i:s') . "\nИмя: $name\nСайт компании: $companySite\nТелефон: $phone\n\n";

		// Запись данных в лог-файл
		if (file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX) === false) {
			die('Ошибка записи в лог.');
		}

		// Успешное завершение
    echo 'Форма успешно обработана! Скачайте <a href="' . $logFile . '" download>лог-файл</a>';

	} else {
    echo 'Форма не была отправлена.';
	}
?>