// screens/ContactInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Linking, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function ContactInfoScreen() {
  const scaleValue = new Animated.Value(0.9);
  const opacityValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePress = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  const contactMethods = [
    {
      icon: 'mail',
      text: 'Thispc119@gmail.com',
      action: () => handlePress(() => Linking.openURL('mailto:Thispc119@gmail.com')),
      color: '#EA4335'
    },
    {
      icon: 'globe',
      text: 'ArpanPatra.com',
      action: () => handlePress(() => Linking.openURL('https://arpanpatra.vercel.app/')),
      color: '#4285F4'
    },
    {
      icon: 'call',
      text: '9111155305',
      action: () => handlePress(() => Linking.openURL('tel:9111155305')),
      color: '#34A853'
    },
    {
      icon: 'logo-whatsapp',
      text: 'Message on WhatsApp',
      action: () => handlePress(() => {
        const phoneNumber = '9111155305';
        const message = 'Hi, I\'d like to get in touch with you regarding your At-Mark App!';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        Linking.openURL(url);
      }),
      color: '#25D366'
    }
  ];

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Animated.View style={[styles.content, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
          <View style={styles.profileContainer}>
            <Image
              source={require('../assets/Arpan.png')}
              style={styles.profileImage}
            />
            <Text style={styles.name}>Arpan Patra</Text>
            <Text style={styles.role}>Full-Stack App Developer</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.skillsContainer}>
            <Text style={styles.sectionTitle}>SKILLS & EXPERTISE</Text>
            <View style={styles.skillsGrid}>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>React Native</Text>
              </View>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>React.js</Text>
              </View>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>Node.js</Text>
              </View>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>TypeScript</Text>
              </View>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>Python</Text>
              </View>
              <View style={styles.skillPill}>
                <Text style={styles.skillText}>UI/UX</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>GET IN TOUCH</Text>
            {contactMethods.map((method, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.contactItem, { backgroundColor: method.color }]}
                onPress={method.action}
                activeOpacity={0.8}
              >
                <Ionicons name={method.icon} size={24} color="#fff" />
                <Text style={styles.contactText}>{method.text}</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" style={styles.contactArrow} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
    paddingTop:9,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 24,
  },
  skillsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -6,
  },
  skillPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 6,
  },
  skillText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  contactContainer: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contactText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
  contactArrow: {
    opacity: 0.8,
  },
});