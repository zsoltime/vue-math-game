const shuffle = (arr) => {
  const array = arr.slice();
  let length = array.length;
  let temp;
  let i;
  while (length) {
    i = Math.floor(Math.random() * length--);
    temp = array[length];
    array[length] = array[i];
    array[i] = temp;
  }
  return array;
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

Vue.component('timer', {
  props: {
    seconds: {
      type: Number,
      default: 10,
    },
    maxSeconds: {
      type: Number,
      default: 30,
    },
  },
  computed: {
    width: function() {
      return `width: ${(this.seconds / this.maxSeconds) * 100}%`;
    }
  },
  template: '\
    <div class="timer"> \
      <div class="timer__wrap"> \
        <div class="timer__inner" :style="width"></div> \
      </div> \
    </div>',
});

Vue.component('modal', {
  template: '\
    <transition name="modal" mode="in-out"> \
      <div class="modal"> \
        <div class="modal__overlay" @click="$emit(\'close\')"></div> \
        <div class="modal__wrapper"> \
          <button class="modal__close" @click="$emit(\'close\')"> \
            &times; \
          </button> \
          <slot></slot> \
        </div> \
      </div> \
    </transition>',
});

new Vue({
  el: '#app',
  data: {
    answer: null,
    answers: null,
    isRunning: false,
    max: 8,
    min: 0,
    operation: 'multiply',
    points: 0,
    question: null,
    showModal: true,
    time: 20,
    wrongAnswers: 0,
  },
  created: function() {
    this.generateQuestion();
    this.generateAnswers();
  },
  methods: {
    resetGame: function() {
      this.generateQuestion();
      this.generateAnswers();
      this.max = 8;
      this.min = 0;
      this.points = 0;
      this.time = 20;
      this.wrongAnswers = 0;
    },
    startGame: function() {
      this.resetGame();
      this.isRunning = true;
      this.showModal = false;
      this.timer = setInterval(this.updateTimer, 1000);
    },
    gameOver: function() {
      this.isRunning = false;
      this.showModal = true;
      clearInterval(this.timer);
    },
    updateTimer: function() {
      if (this.isRunning === false) { return; }
      if (this.time <= 0) {
        this.gameOver();
        return;
      }
      this.time -= 1;
    },
    checkAnswer: function(guess) {
      if (this.answer === guess) {
        this.points += 1;
        this.time += 0.75;
        this.max = this.points % 3 === 0 ? this.max + 1 : this.max;
        this.generateQuestion();
        this.generateAnswers();
      } else {
        if (this.wrongAnswers === 2) {
          this.gameOver();
          return;
        }
        this.time -= 0.5;
        this.wrongAnswers += 1;
      }
    },
    generateQuestion: function() {
      let first, second;
      switch (this.operation) {
        case 'add' :
          first = random(this.min, this.max);
          second = random(this.min, this.max);

          this.question = `${first} + ${second}`;
          this.answer = first + second;
          break;

        case 'subtract' :
          first = random(this.min, this.max);
          second = random(this.min, first);

          this.question = `${first} - ${second}`;
          this.answer = first - second;
          break;

        case 'multiply' :
          first = random(this.min, this.max);
          second = random (this.min, this.max);

          this.question = `${first} × ${second}`;
          this.answer = first * second;
          break;
      }
    },
    generateAnswers: function() {
      const answers = [
        this.answer,
        random(this.min, this.max * 2),
        random(Math.floor(this.max / 2), this.max * 3),
        random(Math.floor(this.max / 3), this.max * 4),
      ];
      this.answers = shuffle(answers);
    },
  },
});
