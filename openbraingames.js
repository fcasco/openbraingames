/* Open Brain Games */
/*globals document,window,console*/
(function OpenBrainGames() {
    'use strict';

    function BrainGame(settings) {
        var symbols_shown,
            game_is_over,
            current_score;

        function update_scores() {
            var game_data = JSON.parse(window.localStorage.look_back || '{"scores": []}'),
                top_scores_ol = document.getElementById('top_scores'),
                i = 0,
                top_score_li, top_score_text;

            if (game_data.scores.indexOf(current_score) === -1) {
                game_data.scores.push(current_score);
                game_data.scores.sort(function (a, b) {
                    return b - a;
                });
            }

            window.localStorage.setItem('look_back', JSON.stringify(game_data));

            while (top_scores_ol.lastChild) {
                top_scores_ol.removeChild(top_scores_ol.lastChild);
            }

            for (i; i < 6; i += 1) {
                if (game_data.scores[i]) {
                    top_score_text = game_data.scores[i].toString();
                    top_score_li = document.createElement('li');
                    top_score_li.appendChild(document.createTextNode(top_score_text));
                    top_scores_ol.appendChild(top_score_li);
                }
            }
        }

        function show_game_info() {
            var arena = document.getElementById('arena'),
                game_info = document.getElementById('game_info');

            arena.className = 'hide';
            game_info.className = '';
        }

        function game_over() {
            var game_timer = document.getElementById('game_timer');

            game_timer.textContent = '-.-';
            game_is_over = true;
            update_scores();
            show_game_info();
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

        function clear_score() {
            var score_element = document.getElementById('score');

            current_score = 0;
            score_element.textContent = current_score.toString();
        }

        function get_new_symbol() {
            var new_symbol_position = Math.floor(Math.random() * 6),
                new_symbol = settings.symbols[new_symbol_position];

            symbols_shown.push(new_symbol);
            return new_symbol;
        }

        function show_symbol() {
            var new_symbol = get_new_symbol(),
                first_symbol_element = document.getElementById('first_symbol'),
                last_symbol_element = document.getElementById('last_symbol');

            function fade_in(element) {
                var current_opacity = parseFloat(element.style.opacity, 10);

                if (current_opacity < 1) {
                    element.style.opacity = (current_opacity + 0.1).toString();
                    window.setTimeout(function () {
                        fade_in(element);
                    }, 50);
                }
            }

            first_symbol_element.textContent = symbols_shown[symbols_shown.length - 2];
            last_symbol_element.textContent = new_symbol;
            last_symbol_element.style.opacity = 0;
            fade_in(last_symbol_element);
        }

        function answer_yes() {
            var score_element = document.getElementById('score'),
                symbols_q = symbols_shown.length,
                score_change = (symbols_shown[symbols_q - 1] === symbols_shown[symbols_q - 2]) ? 1 : -1;

            current_score += score_change;

            if (!game_is_over) {
                score_element.textContent = current_score.toString();
                show_symbol();
            }
        }

        function answer_no() {
            var score_element = document.getElementById('score'),
                symbols_q = symbols_shown.length,
                score_change = (symbols_shown[symbols_q - 1] !== symbols_shown[symbols_q - 2]) ? 1 : -1;

            current_score += score_change;

            if (!game_is_over) {
                score_element.textContent = current_score.toString();
                show_symbol();
            }
        }

        function keyboard_action(ev) {
            switch (ev.keyIdentifier) {
                case 'Right':
                case 'U+004A':
                    answer_yes();
                    break;
                case 'Left':
                case 'U+0046':
                    answer_no();
                    break;
            }
        }

        function show_arena() {
            var arena = document.getElementById('arena'),
                game_info = document.getElementById('game_info');

            arena.className = '';
            game_info.className = 'hide';
        }

        function start_game() {
            game_is_over = false;
            symbols_shown = [];
            current_score = 0;

            show_arena();
            start_timer();
            clear_score();
            show_symbol();
        }

        function init_game() {
            var start_button = document.getElementById('start_button'),
                yes_button = document.getElementById('yes_button'),
                no_button = document.getElementById('no_button');

            update_scores();
            start_button.addEventListener('click', start_game);
            yes_button.addEventListener('click', answer_yes);
            no_button.addEventListener('click', answer_no);
            document.addEventListener('keydown', keyboard_action);
        }

        init_game();
    }

    BrainGame({
        'symbols': ['a', 'b', 'c', 'd', 'e', 'f'],
        'game_time': 10,
    });
}());
