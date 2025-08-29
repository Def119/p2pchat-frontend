import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

// Mock chat data - in a real app, this would come from your backend
const mockChats = [
  {
    id: '1',
    name: 'Alice Johnson',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Thanks for the help earlier!',
    timestamp: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'Carol Davis',
    lastMessage: 'See you tomorrow!',
    timestamp: '3h ago',
    unread: 1,
  },
];

export default function ChatsScreen() {
  const { user, signOut } = useAuth();

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </ThemedText>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <ThemedText style={styles.chatName}>{item.name}</ThemedText>
          <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
        </View>
        <View style={styles.messageRow}>
          <ThemedText style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </ThemedText>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>{item.unread}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Whispr</ThemedText>
          <ThemedText style={styles.subtitle}>Connected. Unseen</ThemedText>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={signOut}>
          <ThemedText style={styles.profileText}>
            {user?.email?.charAt(0).toUpperCase()}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.encryptionStatus}>
          <ThemedText style={styles.encryptionText}>🔐 End-to-End Encrypted</ThemedText>
        </View>
      </View>

      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyText}>
          Start a new conversation to begin chatting securely
        </ThemedText>
        <TouchableOpacity style={styles.newChatButton}>
          <ThemedText style={styles.newChatText}>+ New Chat</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  encryptionStatus: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  encryptionText: {
    fontSize: 12,
    color: '#0891b2',
    fontWeight: '500',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 16,
  },
  newChatButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  newChatText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
