import React from 'react';
import renderer from 'react-test-renderer';
import 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { cleanup } from '@testing-library/react-native/pure';

import LoginPage from '../../app/screens/LoginPage';

describe('<Login />', () => {
    it('renders correctly', () => {
        let topbar = renderer.create(<LoginPage />);
        const tree = topbar.toJSON();
        expect(tree).toMatchSnapshot();
    });


    describe('text input', () => {
        afterEach(cleanup);

        it('username', () => {
            const { getByPlaceholderText, getByText, get } = render(<LoginPage />);
            let element = getByPlaceholderText("Username");
            expect(element).toBeTruthy();
            fireEvent.changeText(element, 'jane');
            expect(element.props.value).toBe('jane');
        });

        it('password', () => {
            const { getByPlaceholderText } = render(<LoginPage />);
            let element = getByPlaceholderText("Password");
            expect(element).toBeTruthy();
            fireEvent.changeText(element, '111');
            expect(element.props.value).toBe('111');
        });
    });

    test.todo('add should be associative');
});

