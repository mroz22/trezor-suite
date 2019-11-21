import {
    addParameters,
    addDecorator,
    configure
} from '@storybook/react';
import {
    withInfo
} from '@storybook/addon-info';
import {
    withKnobs
} from '@storybook/addon-knobs';
import Theme from './theme';

addParameters({
    options: {
        theme: Theme,
        panelPosition: 'right',
    }
});
addDecorator(withInfo);
addDecorator(withKnobs);

function loadStories() {
    require('../src/stories/components/buttons/all');
    require('../src/stories/components/buttons/button');
    require('../src/stories/components/form/all');
    require('../src/stories/components/form/input');
    require('../src/stories/components/icons/all');
    require('../src/stories/components/typography/all');
    require('../src/stories/components/notifications/all');
}

configure(loadStories, module);