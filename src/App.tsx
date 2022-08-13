import { Component, createSignal, For } from 'solid-js';
import * as uuid from 'uuid';
import { DESCRIPTOR, DiaryEntry } from './types';
import { Entry } from './Entry';
import { Feelings } from './Feelings';
import { Reactions } from './Reactions';
import { isIn } from './isIn';
import orderBy from 'lodash/orderBy';

const App: Component = () => {
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

  function updateEntry(entryUpdate: DiaryEntry) {
    const currentEntries = entries();
    const update: DiaryEntry[] = currentEntries.map((entry) => {
      if (entry.id !== entryUpdate.id) return entry;

      return {
        ...entry,
        food: entryUpdate.food,
        feeling: entryUpdate.feeling,
        conditions: entryUpdate.conditions,
      };
    });

    setEntries(update);
    saveState(update);
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
              <Feelings
                selected={selectedFeelAboutFood}
                callback={toggleFeeling}
              />
            </ul>
          </div>
        </div>
        <div class="mr-3 ml-3 sm:ml-0 w-full sm:w-auto">
          <label class="text-[#4D5061] pl-4 text-sm">
            and gave me... (select all that apply)
          </label>
          <ul class="text-white grid grid-cols-3 gap-1 bg-[#4D5061] bg-opacity-30 p-4 rounded">
            <Reactions selected={selectedReactions} callback={toggleReaction} />
          </ul>
        </div>
        <button
          class="bg-[#3D3B30] bg-opacity-85 py-3 px-4 sm:py-6 sm:px-7 rounded text-white mt-6 sm:font-bold"
          onClick={() => addEntry()}
        >
          Add Entry
        </button>
      </section>

      <section class="w-full px-4 max-w-[72rem]">
        {entries().length > 0 && (
          <For each={orderBy(entries(), ['date'], ['desc'])}>
            {(item) => (
              <Entry
                entry={item}
                removeCallback={removeEntry}
                updateCallback={updateEntry}
              />
            )}
          </For>
        )}
      </section>
    </div>
  );
};

export default App;
