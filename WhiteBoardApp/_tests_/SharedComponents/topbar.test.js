import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';


import Topbar from '../../app/screens/shared/Topbar';

describe('<Topbar />', () => {
    // expect(test.someFunc(val)).toEqual(someVal);
    it('renders correctly', () => {
        let topbar = renderer.create(<Topbar />);
        const tree = topbar.toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('Test Title', () => {
        it('Hi', () => {
            const { getByText } = render(<Topbar title='Hi' />);
            const title = getByText('Hi');
            expect(title).toBeTruthy();
        });

        it('Camera', () => {
            let topbar = renderer.create(<Topbar title='Camera' />).getInstance();
            expect(topbar.props.title).toEqual('Camera');
        });
        it('Team18', () => {
            let topbar = renderer.create(<Topbar title='Team18' />).getInstance();
            expect(topbar.props.title).toEqual('Team18');
        });
    });

});