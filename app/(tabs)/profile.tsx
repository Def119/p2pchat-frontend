import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { getPrivateKey, getPublicKey, hasKeys } from '@/lib/crypto';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [keysExist, setKeysExist] = useState(false);
  const [privateKeyPreview, setPrivateKeyPreview] = useState<string>('');
  const [publicKeyPreview, setPublicKeyPreview] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('Checking...');

  useEffect(() => {
    checkKeys();
  }, [user]);

  const checkKeys = async () => {
    try {
      console.log('🔍 Profile: Checking keys...');
      setDebugInfo('Checking keys...');
      
      // Check if keys exist
      const hasKeysResult = await hasKeys();
      console.log('🔍 Profile: Keys exist result:', hasKeysResult);
      setKeysExist(hasKeysResult);

      // Get private key
      const privateKey = await getPrivateKey();
      console.log('🔍 Profile: Private key found:', !!privateKey);
      if (privateKey) {
        setPrivateKeyPreview(`${privateKey.substring(0, 20)}...${privateKey.substring(privateKey.length - 20)}`);
      } else {
        setPrivateKeyPreview('Not found');
      }

      // Get public key from crypto function (which checks user metadata)
      const publicKey = await getPublicKey();
      console.log('🔍 Profile: Public key found:', !!publicKey);
      if (publicKey) {
        setPublicKeyPreview(`${publicKey.substring(0, 20)}...${publicKey.substring(publicKey.length - 20)}`);
      } else {
        setPublicKeyPreview('Not found');
      }

      // Update debug info
      if (hasKeysResult && privateKey && publicKey) {
        setDebugInfo('✅ Both keys found and loaded');
      } else if (hasKeysResult && privateKey && !publicKey) {
        setDebugInfo('⚠️ Private key found, public key missing');
      } else if (!hasKeysResult) {
        setDebugInfo('❌ No keys found - try logging out and back in');
      } else {
        setDebugInfo('⚠️ Partial key setup detected');
      }
      
    } catch (error) {
      console.error('❌ Profile: Error checking keys:', error);
      setDebugInfo(`❌ Error: ${(error as Error).message}`);
      setKeysExist(false);
      setPrivateKeyPreview('Error');
      setPublicKeyPreview('Error');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleExportKeys = () => {
    Alert.alert(
      'Export Keys',
      'This feature allows you to backup your encryption keys. In a real app, this would export your keys securely.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
          <View style={styles.verificationBadge}>
            <ThemedText style={styles.verificationText}>
              ✓ Verified Account
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Security</ThemedText>
          
          <View style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <ThemedText style={styles.securityCardTitle}>🔐 End-to-End Encryption</ThemedText>
              <View style={styles.statusBadge}>
                <ThemedText style={styles.statusText}>{keysExist ? 'Active' : 'Inactive'}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.securityDescription}>
              Your messages are protected with RSA-2048 encryption. Only you and your 
              conversation partners can read your messages.
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleExportKeys}>
            <ThemedText style={styles.menuText}>🔑 Backup Encryption Keys</ThemedText>
            <ThemedText style={styles.menuArrow}>›</ThemedText>
          </TouchableOpacity>

          {/* Development Debug Section */}
          <View style={styles.debugCard}>
            <ThemedText style={styles.debugTitle}>🐛 Debug Info (Development)</ThemedText>
            <View style={styles.debugRow}>
              <ThemedText style={styles.debugLabel}>Status:</ThemedText>
              <ThemedText style={styles.debugValue}>{debugInfo}</ThemedText>
            </View>
            <View style={styles.debugRow}>
              <ThemedText style={styles.debugLabel}>Keys Exist:</ThemedText>
              <ThemedText style={styles.debugValue}>{keysExist ? 'Yes' : 'No'}</ThemedText>
            </View>
            <View style={styles.debugRow}>
              <ThemedText style={styles.debugLabel}>Private Key:</ThemedText>
              <ThemedText style={styles.debugValue}>{privateKeyPreview || 'Not found'}</ThemedText>
            </View>
            <View style={styles.debugRow}>
              <ThemedText style={styles.debugLabel}>Public Key:</ThemedText>
              <ThemedText style={styles.debugValue}>{publicKeyPreview || 'Not found'}</ThemedText>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={checkKeys}>
              <ThemedText style={styles.refreshText}>🔄 Refresh Keys</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: '#ef4444', marginTop: 8 }]} 
              onPress={async () => {
                try {
                  console.log('🔧 Force generating keys...');
                  const { generateKeyPair } = await import('@/lib/crypto');
                  await generateKeyPair();
                  await checkKeys();
                } catch (error) {
                  console.error('❌ Force key generation failed:', error);
                }
              }}
            >
              <ThemedText style={styles.refreshText}>🔧 Force Generate Keys</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          
          <View style={styles.aboutCard}>
            <ThemedText style={styles.appName}>Whispr</ThemedText>
            <ThemedText style={styles.tagline}>Connected. Unseen</ThemedText>
            <ThemedText style={styles.aboutText}>
              A secure peer-to-peer chat application with end-to-end encryption. 
              Your privacy is our priority.
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  verificationBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#6366f1',
  },
  securityCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  securityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '500',
  },
  securityDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    opacity: 0.5,
  },
  aboutCard: {
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Debug styles
  debugCard: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
    marginTop: 12,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400e',
    flex: 1,
  },
  debugValue: {
    fontSize: 12,
    color: '#92400e',
    flex: 2,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  refreshButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  refreshText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
