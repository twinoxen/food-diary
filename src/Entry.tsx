import { Component, createSignal, For, Show } from 'solid-js';
import { DateTime } from 'luxon';
import { DESCRIPTOR, DiaryEntry } from './types';
import { Feelings } from './Feelings';
import { isIn } from './isIn';
import { Reactions } from './Reactions';
import sortBy from 'lodash/sortBy';

export const Entry: Component<{
  entry: DiaryEntry;
  removeCallback: (id: string) => void;
  updateCallback: (entry: DiaryEntry) => void;
}> = ({ entry, removeCallback, updateCallback }) => {
  const [isInEditMode, setIsInEditMode] = createSignal(false);

  function toggleEditMode() {
    setIsInEditMode(!isInEditMode());
  }

  const [food, setFood] = createSignal<string | undefined>(entry.food);

  const [selectedFeelAboutFood, setSelectedFeelAboutFood] = createSignal<
    DESCRIPTOR | undefined
  >(entry.feeling);

  const [selectedReactions, setSelectedReactions] = createSignal<DESCRIPTOR[]>(
    entry?.conditions || []
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

  function saveChanges() {
    updateCallback({
      ...entry,
      food: food(),
      feeling: selectedFeelAboutFood(),
      conditions: selectedReactions(),
    });
  }

  return (
    <>
      <div class="md:grid md:grid-cols-5">
        <div class="px-4 py-2 text-[#4D5061] text-sm">
          {DateTime.fromISO(entry.date).toFormat('ff')}
        </div>
        <Show when={!isInEditMode()}>
          <div class="px-4 py-2 text-[#4D5061] text-sm hidden md:block">
            made me feel...
          </div>
        </Show>
        <Show when={!isInEditMode()}>
          <div class="px-4 py-2 text-[#4D5061] text-sm hidden md:block">
            and gave me...
          </div>
        </Show>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-5 md:grid-flow-row gap-2 bg-[#4D5061] bg-opacity-30 rounded p-4 mb-4 items-start">
        {isInEditMode() === true ? (
          <div class="bg-[#4D5061] bg-opacity-30 p-4 rounded md:col-span-2">
            <input
              class="h-10 rounded p-3 justify-center items-center w-full"
              type="text"
              placeholder="What did you eat?"
              value={food()}
              onChange={(event) => setFood(event.currentTarget.value)}
            />
          </div>
        ) : (
          <div>{entry.food}</div>
        )}
        <div class="mt-3 text-[#4D5061] text-sm md:hidden">made me feel...</div>

        {isInEditMode() === true ? (
          <ul class="text-white flex w-full md:w-auto md:col-span-3">
            <Feelings
              selected={selectedFeelAboutFood}
              callback={toggleFeeling}
            />
          </ul>
        ) : (
          <div class="text-white">
            <button
              class="flex items-center text-lx md:text-2xl p-1.5 py-1 bg-[#4D5061] rounded"
              title={entry.feeling?.name}
            >
              <span class="mr-1.5">{entry.feeling?.emoji}</span>
              <span class="text-sm md:text-lg">{entry.feeling?.name}</span>
            </button>
          </div>
        )}

        <div class="mt-3 text-[#4D5061] text-sm md:hidden">and gave me...</div>

        {isInEditMode() === true ? (
          <ul class="text-white grid grid-cols-3 gap-1 bg-[#4D5061] bg-opacity-30 p-4 rounded md:col-span-3 md:col-start-3">
            <Reactions selected={selectedReactions} callback={toggleReaction} />
          </ul>
        ) : (
          <div class="flex flex-wrap gap-2 md:col-span-2">
            <For each={sortBy(entry.conditions, ['name'])}>
              {(condition) => (
                <button
                  class="flex items-center text-lx md:text-2xl p-1.5 py-1 bg-[#4D5061] rounded text-white"
                  title={condition.name}
                >
                  <span class="mr-1.5">{condition.emoji}</span>
                  <span class="text-sm md:text-lg">{condition.name}</span>
                </button>
              )}
            </For>
            {entry.conditions?.length === 0 && (
              <span class="flex items-center text-lx md:text-2xl p-1.5 py-1 bg-[#4D5061] rounded text-white">
                No reaction
              </span>
            )}
          </div>
        )}

        <div
          class="justify-self-end "
          classList={{ 'md:col-span-5': isInEditMode() }}
        >
          {isInEditMode() === true ? (
            <>
              <button
                class="bg-[#3D3B30] bg-opacity-85 py-3 px-4 md:py-6 md:px-7 rounded text-white mt-6 md:font-bold mr-2"
                onClick={saveChanges}
              >
                Save
              </button>
              <button
                class="bg-[#3D3B30] bg-opacity-85 py-3 px-4 md:py-6 md:px-7 rounded text-white mt-6 md:font-bold"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
            </>
          ) : (
            <button class="text-2xl ml-2" onClick={toggleEditMode}>
              ✏️
            </button>
          )}

          <Show when={!isInEditMode()}>
            <button
              class="text-2xl ml-4"
              onClick={() => removeCallback(entry.id)}
            >
              ❌
            </button>
          </Show>
        </div>
      </div>
    </>
  );
};
