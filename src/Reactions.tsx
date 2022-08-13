import { Accessor, Component, For } from 'solid-js';
import { isIn } from './isIn';
import { DESCRIPTOR } from './types';
import sortBy from 'lodash/sortBy';

export const Reactions: Component<{
  selected: Accessor<DESCRIPTOR[]>;
  callback: (item: DESCRIPTOR) => void;
}> = ({ selected, callback }) => {
  const reactions: DESCRIPTOR[] = sortBy(
    [
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
    ],
    ['name']
  );

  return (
    <For each={reactions}>
      {(item) => (
        <li>
          <button
            class="w-full flex items-center text-lx sm:text-2xl p-1.5 py-1 bg-[#4D5061] rounded"
            classList={{
              'bg-[#E7E247]': isIn(item, selected()),
              'text-black': isIn(item, selected()),
            }}
            title={item.name}
            onClick={() => callback(item)}
          >
            <span class="mr-1.5">{item.emoji}</span>
            <span class="text-sm sm:text-lg">{item.name}</span>
          </button>
        </li>
      )}
    </For>
  );
};
