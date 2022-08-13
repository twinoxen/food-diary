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
    { name: 'Vomiting', emoji: '🤮' },
    { name: 'Rash', emoji: '😳' },
    { name: 'Chills', emoji: '🥶' },
    { name: 'Fever', emoji: '🥵' },
    { name: 'Heart Burn', emoji: '❤️‍🔥' },
  ];

  const [entries, setEntries] = createSignal<DiaryEntry[]>(loadState());

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

    const newList = [...entries(), newEntry];

    saveState(newList);
    setEntries(newList);
    setFood('');
    setSelectedFeelAboutFood(undefined);
    setSelectedReactions([]);
  }

  function removeEntry(id: string) {
    const newList = [...entries().filter((entry) => entry.id !== id)];

    saveState(newList);
    setEntries(newList);
  }

  function loadState() {
    return localStorage.getItem('diary')
      ? JSON.parse(localStorage.getItem('diary') || '')
      : [];
  }

  function saveState(state: DiaryEntry[]) {
    localStorage.setItem('diary', JSON.stringify(state));
  }

  return (
    <div class="min-h-[100vh] flex flex-col justify-center bg-[#E9EDDE] items-center">
      <header class="text-center text-black text-5xl mb-10 font-thin pt-4">
        Food Diary
      </header>

      <section class="flex flex-wrap content-start justify-center items-start mb-6">
        <div class="mr-3 ml-3 sm:ml-0 mb-4 w-full sm:w-auto">
          <label class="text-[#4D5061] pl-4 text-sm">this food</label>
          <div class="bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <input
              class="h-10 rounded p-3 justify-center items-center w-full sm:w-auto"
              type="text"
              placeholder="What did you eat?"
              value={food()}
              onChange={(event) => setFood(event.currentTarget.value)}
            />
          </div>
        </div>
        <div class="mr-3 ml-3 sm:ml-0 mb-4 w-full sm:w-auto">
          <label class="text-[#4D5061] pl-4 text-sm">made me feel...</label>
          <div class="bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <ul class="text-white flex w-full sm:w-auto">
              <For each={feelAboutFood}>
                {(item) => (
                  <li
                    class="bg-[#4D5061] first:rounded-l last:rounded-r mr-px last:mr-0 flex-1"
                    classList={{
                      'bg-[#E7E247]': isIn(item, selectedFeelAboutFood()),
                      'text-black': isIn(item, selectedFeelAboutFood()),
                    }}
                  >
                    <button
                      class="text-lx sm:text-2xl p-2 py-1 flex items-center"
                      title={item.name}
                      onClick={() => toggleFeeling(item)}
                    >
                      <span class="mr-1.5">{item.emoji}</span>
                      <span class="text-sm sm:text-lgg">{item.name}</span>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
        <div class="mr-3 ml-3 sm:ml-0 w-full sm:w-auto">
          <label class="text-[#4D5061] pl-4 text-sm">
            and gave me... (select all that apply)
          </label>
          <ul class="text-white grid grid-cols-3 gap-1 bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <For each={reactions}>
              {(item) => (
                <li>
                  <button
                    class="w-full flex items-center text-lx sm:text-2xl p-1.5 py-1 bg-[#4D5061] rounded"
                    classList={{
                      'bg-[#E7E247]': isIn(item, selectedReactions()),
                      'text-black': isIn(item, selectedReactions()),
                    }}
                    title={item.name}
                    onClick={() => toggleReaction(item)}
                  >
                    <span class="mr-1.5">{item.emoji}</span>
                    <span class="text-sm sm:text-lg">{item.name}</span>
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
        <button
          class="bg-[#3D3B30] bg-opacity-85 py-3 px-4 sm:py-6 sm:px-7 rounded text-white mt-6 sm:font-bold"
          onClick={() => addEntry()}
        >
          Add Entry
        </button>
      </section>

      <section class="w-full sm:w-auto px-4 max-w-[72rem] lg:min-w-[66rem] md:min-w-[56rem]">
        {entries().length > 0 && (
          <>
            <For each={entries().reverse()}>
              {(item) => (
                <>
                  <div class="sm:grid sm:grid-cols-5">
                    <div class="px-4 py-2 text-[#4D5061] text-sm">
                      {DateTime.fromISO(item.date).toFormat('ff')}
                    </div>
                    <div class="px-4 py-2 text-[#4D5061] text-sm hidden sm:block">
                      made me feel...
                    </div>
                    <div class="px-4 py-2 text-[#4D5061] text-sm hidden sm:block">
                      and gave me...
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-[#4D5061] bg-opacity-30 rounded p-4 mb-4 items-start">
                    <div>{item.food}</div>
                    <div class="mt-3 text-[#4D5061] text-sm sm:hidden">
                      made me feel...
                    </div>
                    <div class="text-white">
                      <button
                        class="flex items-center text-lx sm:text-2xl p-1.5 py-1 bg-[#4D5061] rounded"
                        title={item.feeling?.name}
                      >
                        <span class="mr-1.5">{item.feeling?.emoji}</span>
                        <span class="text-sm sm:text-lg">
                          {item.feeling?.name}
                        </span>
                      </button>
                    </div>
                    <div class="mt-3 text-[#4D5061] text-sm sm:hidden">
                      and gave me...
                    </div>
                    <div class="flex flex-wrap gap-2 sm:col-span-2">
                      <For each={item.conditions}>
                        {(condition) => (
                          <button
                            class="flex items-center text-lx sm:text-2xl p-1.5 py-1 bg-[#4D5061] rounded text-white"
                            title={condition.name}
                          >
                            <span class="mr-1.5">{condition.emoji}</span>
                            <span class="text-sm sm:text-lg">
                              {condition.name}
                            </span>
                          </button>
                        )}
                      </For>
                      {item.conditions?.length === 0 && (
                        <span class="flex items-center text-lx sm:text-2xl p-1.5 py-1 bg-[#4D5061] rounded text-white">
                          No reaction
                        </span>
                      )}
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
                </>
              )}
            </For>
          </>
        )}
      </section>
    </div>
  );
};

export default App;
