import React, { useEffect } from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native'

import * as authActions from '../centralstore/actions/auth'
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';

const StartupScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth');
                return;
            }

            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId, token, expirationDate.getTime() - new Date().getTime()));
        };

        tryLogin();
    }, [dispatch]);
    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen;