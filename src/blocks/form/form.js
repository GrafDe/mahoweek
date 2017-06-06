// Form
//------------------------------------------------------------------------------

// Настраиваем
//------------------------------------------------------------------------------

(function() {

	// Отменяем отправку формы по сабмиту
	SETTINGS_FORM.on('submit', function(event) {
		event.preventDefault();
	});

	// Парсим хранилище
	var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

	// Определяем текущие параметры
	var theme = mahoweekStorage.settings.theme;

	// Выделяем текущую тему как активную
	SETTINGS_FORM.find('.js-choose-theme[value="' + theme + '"]').attr('checked', 'checked');

	// Сохраняем параметры
	SETTINGS_FORM.find(':checkbox, :radio').on('change', function() {
		// Определяем новые параметры
		theme = SETTINGS_FORM.find('.js-choose-theme[name="theme"]:checked').val();

		// Изменяем тему у доски
		THEME_BOARD.attr('class', 'board__theme  board__theme--' + theme);

		// Изменяем параметры
		mahoweekStorage.settings.theme = theme;

		// Обновляем хранилище
		localStorage.setItem('mahoweek', JSON.stringify(mahoweekStorage));
	});

}());
