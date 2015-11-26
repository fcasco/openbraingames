/* Open Brain Games */
/*globals document,window,console*/
(function OpenBrainGames() {
    'use strict';

    function BrainGame(settings) {
        var last_symbol = null,
            game_is_over = false;

        function game_over() {
            var game_timer = document.getElementById('game_timer');

            game_timer.textContent = '-.-';
            game_is_over = true;
        }

        function update_timer() {
            var game_timer = document.getElementById('game_timer'),
                current_time = parseInt(game_timer.textContent, 10);

            if (current_time > 0) {
                current_time -= 1;
                game_timer.textContent = current_time.toString();
                window.setTimeout(update_timer, 1000);
            } else {
                game_over();
            }
        }

        function start_timer() {
            var game_timer = document.getElementById('game_timer');

            console.log('start_timer');
            game_timer.textContent = settings.game_time.toString();
            window.setTimeout(update_timer, 1000);
        }

        function get_new_symbol() {
            var new_symbol = Math.floor(Math.random() * 6);

            return settings.symbols[new_symbol];
        }

        function show_symbol() {
            var new_symbol = get_new_symbol(),
                current_symbol = document.getElementById('current_symbol');

            function fade_in(element) {
                var current_opacity = parseFloat(element.style.opacity, 10);

                if (current_opacity < 1) {
                    element.style.opacity = (current_opacity + 0.1).toString();
                    window.setTimeout(function () {
                        fade_in(element);
                    }, 50);
                }
            }

            current_symbol.style.opacity = 0;
            fade_in(current_symbol);

            last_symbol = current_symbol.textContent;
            current_symbol.textContent = new_symbol;
        }


        function answer_yes() {
            var current_symbol = document.getElementById('current_symbol'),
                score_element = document.getElementById('score'),
                current_score = parseInt(score_element.textContent, 10),
                score_change = (current_symbol.textContent === last_symbol) ? 1 : -1,
                new_score = current_score + score_change;

            if (!game_is_over) {
                score_element.textContent = new_score.toString();
                show_symbol();
            }
        }


        function answer_no() {
            var current_symbol = document.getElementById('current_symbol'),
                score_element = document.getElementById('score'),
                current_score = parseInt(score_element.textContent, 10),
                score_change = (current_symbol.textContent !== last_symbol) ? 1 : -1,
                new_score = current_score + score_change;

            if (!game_is_over) {
                score_element.textContent = new_score.toString();
                show_symbol();
            }
        }


        function start_game() {
            var arena = document.getElementById('arena');

            arena.className = '';
            game_is_over = false;
            start_timer();
            show_symbol();
        }


        function init_game() {
            var start_button = document.getElementById('start_button'),
                yes_button = document.getElementById('yes_button'),
                no_button = document.getElementById('no_button');
            console.log('init_game');

            start_button.addEventListener('click', start_game);
            yes_button.addEventListener('click', answer_yes);
            no_button.addEventListener('click', answer_no);
        }

        init_game();
    }

    BrainGame({
        'symbols': ['grade', 'stop', 'play_arrow', 'album', 'games', 'settings'],
        'game_time': 10,
    });

}());
