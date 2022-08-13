import { Component, createSignal, For } from 'solid-js';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

export interface DESCRIPTOR {
  name: string;
  emoji: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  food: string | undefined;
  feeling: DESCRIPTOR | undefined;
  conditions: DESCRIPTOR[] | undefined;
}

const App: Component = () => {
  const feelAboutFood: DESCRIPTOR[] = [
    { name: 'Good', emoji: '😄' },
    { name: 'Neutral', emoji: '😐' },
    { name: 'Bad', emoji: ' 😢' },
  ];

  const reactions: DESCRIPTOR[] = [
    { name: 'Bloated', emoji: '🫃' },
    { name: 'Constipated', emoji: '😬' },
    { name: 'Diarrhea', emoji: '💩' },
    { name: 'Gas', emoji: '💨' },
    { name: 'Belching', emoji: '😮‍💨' },
    { name: 'Joint Pain', emoji: '🦵' },
    { name: 'Nausea', emoji: '🤢' },
    { name: 'Rash', emoji: '😳' },
    { name: 'Chills', emoji: '🥶' },
    { name: 'Fever', emoji: '🥵' },
    { name: 'Heart Burn', emoji: '❤️‍🔥' },
  ];

  const savedEntries = localStorage.getItem('diary')
    ? JSON.parse(localStorage.getItem('diary') || '')
    : [];
  const [entries, setEntries] = createSignal<DiaryEntry[]>(savedEntries);

  const [food, setFood] = createSignal<string>('');
  const [selectedFeelAboutFood, setSelectedFeelAboutFood] =
    createSignal<DESCRIPTOR>();
  const [selectedReactions, setSelectedReactions] = createSignal<DESCRIPTOR[]>(
    []
  );

  function toggleFeeling(feeling: DESCRIPTOR) {
    setSelectedFeelAboutFood(feeling);
  }

  function toggleReaction(reaction: DESCRIPTOR) {
    if (isIn(reaction, selectedReactions())) {
      setSelectedReactions([
        ...selectedReactions().filter((item) => item.name !== reaction.name),
      ]);

      return;
    }

    setSelectedReactions([...selectedReactions(), reaction]);
  }

  function isIn(
    selector: DESCRIPTOR,
    collection: DESCRIPTOR | DESCRIPTOR[] | undefined
  ) {
    if (typeof collection === 'undefined') return;

    collection = Array.isArray(collection) ? collection : [collection];
    return !!collection.find((item: DESCRIPTOR) => item.name === selector.name);
  }

  function addEntry() {
    if (!food() || !selectedFeelAboutFood()) return;

    const newEntry: DiaryEntry = {
      id: uuid.v4(),
      food: food(),
      date: new Date().toISOString(),
      feeling: selectedFeelAboutFood(),
      conditions: selectedReactions(),
    };

    const newList = [...entries(), newEntry]

    localStorage.setItem('diary', JSON.stringify(newList));

    setEntries(newList);
    setFood('');
    setSelectedFeelAboutFood(undefined);
    setSelectedReactions([]);
  }

  function removeEntry(id: string) {
    const newList = [...entries().filter((entry) => entry.id !== id)]

    localStorage.setItem('diary', JSON.stringify(newList));

    setEntries(newList);
  }

  return (
    <div class="min-h-[100vh] flex flex-col justify-center bg-[#E9EDDE] items-center">
      <header class="text-center text-black text-5xl mb-10 font-thin">
        Food Diary
      </header>

      <section class="flex flex-wrap content-start justify-center items-start mb-4">
        <div class="mr-3 mb-4 flex-grow-0">
          <label class="text-[#4D5061] pl-4 text-sm">this food</label>
          <div class="bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <input
              class="h-10 rounded p-3 justify-center items-center"
              type="text"
              placeholder="What did you eat?"
              value={food()}
              onChange={(event) => setFood(event.currentTarget.value)}
            />
          </div>
        </div>
        <div class="mr-3 mb-4">
          <label class="text-[#4D5061] pl-4 text-sm">made me feel...</label>
          <div class="bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <ul class="text-white flex">
              <For each={feelAboutFood}>
                {(item) => (
                  <li
                    class="bg-[#4D5061] first:rounded-l last:rounded-r mr-px last:mr-0"
                    classList={{
                      'bg-[#E7E247]': isIn(item, selectedFeelAboutFood()),
                    }}
                  >
                    <button
                      class="text-2xl p-1.5 py-1"
                      title={item.name}
                      onClick={() => toggleFeeling(item)}
                    >
                      {item.emoji}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
        <div class="mr-3 mb-4">
          <label class="text-[#4D5061] pl-4 text-sm">
            and gave me... (select all that apply)
          </label>
          <ul class="text-white flex flex-wrap bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <For each={reactions}>
              {(item) => (
                <li>
                  <button
                    class="text-2xl p-1.5 py-1 bg-[#4D5061] rounded mr-1"
                    classList={{
                      'bg-[#E7E247]': isIn(item, selectedReactions()),
                    }}
                    title={item.name}
                    onClick={() => toggleReaction(item)}
                  >
                    {item.emoji}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
        <button
          class="bg-[#3D3B30] bg-opacity-85 py-6 px-7 rounded text-white mt-6 font-bold"
          onClick={() => addEntry()}
        >
          Add Entry
        </button>
      </section>

      <section class="px-5 max-w-[66rem] lg:min-w-[66rem] md:min-w-[56rem]">
        {entries().length > 0 && (
          <>
            <div class="grid grid-cols-5 px-4 py-2 text-[#4D5061] pl-4 text-sm">
              <div>Date</div>
              <div>Food</div>
              <div>it made me feel</div>
              <div>it gave me</div>
              <div></div>
            </div>
            <For each={entries()}>
              {(item) => (
                <div class="grid grid-cols-5 bg-[#4D5061] bg-opacity-30 rounded p-4 mb-4 items-center">
                  <div>{DateTime.fromISO(item.date).toFormat('ff')}</div>
                  <div>{item.food}</div>
                  <div class="text-2xl">
                    <button title={item.feeling?.name}>
                      {item.feeling?.emoji}
                    </button>
                  </div>
                  <div>
                    <For each={item.conditions}>
                      {(condition) => (
                        <button title={condition.name} class="text-2xl mr-2">
                          {condition.emoji}
                        </button>
                      )}
                    </For>
                  </div>
                  <div class="justify-self-end">
                    <button
                      class="text-2xl ml-2"
                      onClick={() => removeEntry(item.id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}
            </For>
          </>
        )}
      </section>
    </div>
  );
};

export default App;
