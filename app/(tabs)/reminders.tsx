import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getCurrentUser, getReminders, Reminder, UserDocument } from '@/src/lib/appwrite';

const ReminderItem = ({ item }: { item: Reminder }) => {
    const isCompleted = item.isCompleted;
    return (
        <View style={[styles.reminderContainer, isCompleted && styles.completedReminder]}>
            <ThemedText style={[styles.reminderTitle, isCompleted && styles.completedText]}>
                {item.title}
            </ThemedText>
            {item.description && (
                <ThemedText style={[styles.reminderDescription, isCompleted && styles.completedText]}>
                    {item.description}
                </ThemedText>
            )}
            <ThemedText style={styles.dueDate}>Due: {new Date(item.dueDate).toLocaleString()}</ThemedText>
        </View>
    );
};

export default function RemindersScreen() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [currentUser, setCurrentUser] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchUserAndReminders = async () => {
            try {
                setLoading(true);
                setError(null);
                const user = await getCurrentUser();
                setCurrentUser(user);
                if (user) {
                    const fetchedReminders = await getReminders(user.$id);
                    setReminders(fetchedReminders);
                } else {
                    setError('You must be logged in to see reminders.');
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load reminders.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndReminders();
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.center}>
                <ThemedText type="subtitle">{error}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Your Reminders
            </ThemedText>
            {reminders.length === 0 ? (
                <View style={styles.center}>
                    <ThemedText>You have no reminders.</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={reminders}
                    renderItem={({ item }) => <ReminderItem item={item} />}
                    keyExtractor={(item) => item.$id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    reminderContainer: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    completedReminder: {
        backgroundColor: '#e0e0e0',
        borderColor: '#c0c0c0',
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reminderDescription: {
        fontSize: 14,
        marginTop: 5,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    dueDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
        textAlign: 'right',
    },
});
