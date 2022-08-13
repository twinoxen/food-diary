import { Accessor, Component, For } from 'solid-js';
import { isIn } from './isIn';
import { DESCRIPTOR } from './types';

export const Feelings: Component<{
  selected: Accessor<DESCRIPTOR | undefined>;
  callback: (item: DESCRIPTOR) => void;
}> = ({ selected, callback }) => {
  const feelings: DESCRIPTOR[] = [
    { name: 'Good', emoji: '😄' },
    { name: 'Neutral', emoji: '😐' },
    { name: 'Bad', emoji: ' 😢' },
  ];

  return (
    <For each={feelings}>
      {(item) => (
        <li
          class="bg-[#4D5061] first:rounded-l last:rounded-r mr-px last:mr-0 flex-1"
          classList={{
            'bg-[#E7E247]': isIn(item, selected()),
            'text-black': isIn(item, selected()),
          }}
        >
          <button
            class="text-lx sm:text-2xl p-2 py-1 flex items-center"
            title={item.name}
            onClick={() => callback(item)}
          >
            <span class="mr-1.5">{item.emoji}</span>
            <span class="text-sm sm:text-lgg">{item.name}</span>
          </button>
        </li>
      )}
    </For>
  );
};
