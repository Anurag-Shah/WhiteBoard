import React from 'react';
import renderer from 'react-test-renderer';
import 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { cleanup, waitFor } from '@testing-library/react-native/pure';
import { act } from 'react-test-renderer';

import LoginPage from '../../app/screens/LoginPage';

jest.dontMock('fs');
jest.dontMock('path');

describe('Login', () => {
    it('renders correctly', () => {
        let topbar = renderer.create(<LoginPage />);
        const tree = topbar.toJSON();
        expect(tree).toMatchSnapshot();
    });


    describe('text input', () => {
        afterEach(cleanup);

        it('username', () => {
            const rendered = render(<LoginPage />);
            let element = rendered.getByPlaceholderText("Username");
            expect(element).toBeTruthy();
            act(() => {
                fireEvent.changeText(element, 'jane');
            });
            expect(element.props.value).toBe('jane');
        });

        it('password', () => {
            const { getByPlaceholderText } = render(<LoginPage />);
            let element = getByPlaceholderText("Password");
            expect(element).toBeTruthy();
            fireEvent.changeText(element, '111');
            expect(element.props.value).toBe('111');
        });

        it('username and password', () => {
            const rendered = render(<LoginPage />);
            let pwd = rendered.getByPlaceholderText("Password");
            let username = rendered.getByPlaceholderText("Username");
            expect(pwd).toBeTruthy();
            expect(username).toBeTruthy();
            fireEvent.changeText(pwd, '111');
            fireEvent.changeText(username, 'jack');
            expect(username.props.value).toBe('jack');
            expect(pwd.props.value).toBe('111');
        });

    });

    test.todo('add should be associative');
});

