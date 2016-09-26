(function () {
    var questions = [{
        question: "Where is PRODYNA headquartered?",
        help: "( select only one )",
        choices: ['Hamburg', 'Frankurt', 'Eschborn', 'Essen'],
        correctAnswer: [2]
    }, {
        question: "Which of the following companies are partners of PRODYNA?",
        help: "( select all that apply )",
        choices: ['Drupal', 'Neo4j', 'Liferay', 'Magnolia', 'MongoDB', 'SAP'],
        correctAnswer: [1, 2, 3, 4]
    }, {
        question: "In which of the following countries is PRODYNA present?",
        help: "( select all that apply )",
        choices: ['France', 'Switzerland', 'Belgium', 'Austria', 'Serbia', 'Germany'],
        correctAnswer: [1, 3, 4, 5]
    }, {
        question: "Is multiple inheritance allowed in Java?",
        help: "( select only one )",
        choices: ['Yes', 'No', 'Depends on Java version'],
        correctAnswer: [1]
    }, {
        question: "Which method must be implemented by all threads?",
        help: "( select only one )",
        choices: ['wait()', 'start()', 'stop()', 'run()'],
        correctAnswer: [3]
    }, {
        question: "Which class is at the root of inheritance tree in Java?",
        help: "( select only one )",
        choices: ['Init', 'Object', 'Class', 'None of the above'],
        correctAnswer: [1]
    }];

    var questionCounter = 0,
        selections = [],
        quiz = $('#quiz'),
        $start = $('#start'),
        $next = $('#next');

    // Prikazi pitanja
    displayNext();

    $next.on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        if (!selections[questionCounter].length) {
            $('.overlay-div').fadeIn('fast').animate({"opacity": "1"}, 700);
            $('.overlay-div .button').click(function(){
                $(this).parent().fadeOut("slow", function () {
                    $(this).css({display: "none"});
                });
            });
            return false;
        } else {
            questionCounter++;
            displayNext();
        }

    });

    // Vrati na pocetak
    $start.on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Sta mi je ovo uopste trebalo
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Question ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var help = $('<p>', {'class': 'help'}).append(questions[index].help);
        qElement.append(help);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Napravi inpute i stavi u tabelu
    function createRadios(index) {
        var table = $('<table>');
        var tableTr = $('<tr>');
        var tableTd;
        var label;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            if (index == 0 || index == 3 || index == 4 || index == 5) {
                tableTd = $('<td>', {'class': 'roundedOne'});
                label = $('<label for="checkboxG' + i + '"><span><span></span></span></label>');
                input = '<input type="radio" name="checkboxG' + i + '" id="checkboxG' + i + '" class="css-checkbox" value=' + i + ' />';
                input += questions[index].choices[i];
                tableTd.append(input);
                tableTd.append(label);
                tableTr.append(tableTd);
                table.append(tableTr);
            } else {
                tableTd = $('<td>');
                label = $('<label for="checkboxG' + i + '" class="css-label" ></label>');
                input = '<input type="checkbox" name="checkboxG' + i + '" id="checkboxG' + i + '" class="css-checkbox" value=' + i + ' />';
                input += questions[index].choices[i];
                tableTd.append(input);
                tableTd.append(label);
                tableTr.append(tableTd);
                table.append(tableTr);
            }
        }
        return table;
    }

    // Ubaci u niz cekiran element
    function choose() {
        var checkBox = document.querySelectorAll('input[type="checkbox"]:checked'),
            radioButton = document.querySelectorAll('input[type="radio"]:checked');
        if (checkBox.length) {
            inputs = checkBox
        } else {
            inputs = radioButton
        }
        var names = [].map.call(inputs, function (input) {
                return input.value;
            }).join(','),
            input = JSON.parse("[" + names + "]");
        selections[questionCounter] = input;
    }

    // Daj mi sledece pitanje
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();

            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                $next.show();
                preventRadio();
            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $next.hide();
                $start.show();
            }
        });
    }

    // Izracunaj rezultat i prikazi
    function displayScore() {
        var score = $('<p>', {id: 'question'}),
            numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (JSON.stringify(selections[i]) === JSON.stringify(questions[i].correctAnswer)) {
                numCorrect++;
            }
        }

        score.append('You have correctly answered ' + numCorrect + ' out of ' +
            questions.length + ' questions!!!');
        return score;
    }

    // Dozvoli samo jedan radio button
    function preventRadio() {
        $('input[type="radio"]').on('change', function () {
            $('input[type="radio"]').not(this).prop('checked', false);
        });
    }
})();