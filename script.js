const createElements = (arr) => {
  const htmlElement = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  // Create a speech utterance object
  const utterance = new SpeechSynthesisUtterance(word);

  // Set the language (voices depend on browser/system)
  utterance.lang = "en-EN"; // Better to use "en-US" or "en-GB"

  // Speak the word
  window.speechSynthesis.speak(utterance);
}


const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

//  animation for loading
const LoadAnimation = (status) => {
  if (status == true) {
    document.getElementById("load_ani").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("load_ani").classList.add("hidden");
  }
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadWord = (id) => {
  LoadAnimation(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  //   console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayWord(data.data);
    });
};

const displayWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
          <div class="text-center bg-[#F8F8F8] col-span-full py-10 space-y-6 font-bangla">
          <img class="mx-auto" src="./assets/alert-error.png" />
            <p class="text-xl font-medium text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>`;
    LoadAnimation(false);
    return;
  }

  words.forEach((word) => {
    // console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `        <div class="bg-white rounded-xl shadow-sm text-center py-20 px-5 space-y-4 ">
            <h2 class="font-bold text-xl">${
              word.word ? word.word : "শব্দ পাওয়া যায়নি"
            }</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class="text-2xl font-medium font-bangla">"${
              word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
            } / ${word.pronunciation ? word.pronunciation : "not found "}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${
                  word.id
                })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${
                  word.word
                }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]""><i class=" fa-solid
                    fa-volume-low"></i></button>
            </div>
        </div>`;
    wordContainer.append(card);
  });
  LoadAnimation(false);
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displyDetails(details.data);
};

const displyDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
              <div class="">
            <h2 class="text=2xl font=bold">${
              word.word
            } ( <i class="fa-solid fa-microphone"></i> :${
    word.pronunciation
  })</h2>
        </div>
        <div class="">
            <h2 class=" font=bold">Meaning</h2>
            <p>${word.meaning}</p>
        </div>
        <div class="">
            <h2 class=" font=bold">Example</h2>
            <p>${word.sentence}</p>
        </div>
        <div class="">
        <div>${createElements(word.synonyms)}</div>

        </div>

  `;
  document.getElementById("my_modal_5").showModal();
};

const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onClick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
      </button>
    `;
    levelContainer.append(btnDiv);
  }
};

loadLessons(); // jhamela suru

document.getElementById("btn-search").addEventListener("click", () => {
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayWord(filterWords);
    });
});
