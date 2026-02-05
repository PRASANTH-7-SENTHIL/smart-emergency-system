export type Language = 'en' | 'ta' | 'hi';

export type TranslationKey = string;

export const translations = {
    en: {
        sidebar: {
            dashboard: 'Dashboard',
            accidentSpot: 'Accident Spot',
            driverMonitor: 'Driver Monitor',
            aiAssistant: 'AI Assistant',
            dailyNews: 'Daily News',
            weatherSensors: 'Weather & Sensors',
            speedTracking: 'Speed Tracking',
            accidentCapture: 'Accident Capture',
            settings: 'Settings',
            weatherStatus: 'Weather Status',
            theme: 'Theme',
            systemStatus: 'System Status:',
            online: 'Online',
        },
        settings: {
            title: 'System Settings',
            description: 'Configure alerts, preferences, and system parameters.',
            appearance: 'Appearance',
            themeMode: 'Theme Mode',
            themeDesc: 'Switch between light and dark themes',
            switchToDark: 'Switch to Dark',
            switchToLight: 'Switch to Light',
            language: 'Language',
            selectLanguage: 'Select Language',
            languageDesc: 'Choose your preferred language',
            safetyExtensions: 'Safety Extensions',
            smsAlerts: 'SMS Alerts',
            smsDesc: 'Send SMS to emergency contacts automatically',
            gpsTracking: 'Background GPS Tracking',
            gpsDesc: 'Keep tracking vehicle even when tabs are closed',
            saveChanges: 'Save Changes',
            gmailNotifications: 'Gmail Notifications',
            gmailDesc: 'Show latest email from your Gmail inbox',
            connectGmail: 'Connect Gmail',
            gmailConnected: 'Gmail Connected',
            noNewMail: 'No new mail',
        },
        common: {
            loading: 'Loading...'
        },
        dashboard: {
            title: 'Emergency Response Dashboard',
            subtitle: 'Access emergency services, blood bank information, accident reporting, and driver monitoring all in one place.',
            emergencyCall: 'Emergency Call',
            learnMore: 'Learn More',
            cards: {
                accidentSpot: {
                    title: 'Accident Spot',
                    desc: 'Report accidents and get emergency services dispatched to your location',
                    action: 'Report'
                },
                driverMonitoring: {
                    title: 'Driver Monitoring',
                    desc: 'Monitor driver behavior and receive alerts for unsafe driving patterns',
                    action: 'Monitor'
                },
                chat: {
                    title: 'Chat with Us',
                    desc: 'Get immediate assistance through our live chat support system',
                    action: 'Chat Now'
                }
            }
        },
        news: {
            title: 'Daily Traffic & Safety News',
            subtitle: 'Stay updated with the latest road safety updates.',
            refresh: 'Refresh News',
            noNews: 'No news available at the moment.',
            readFull: 'Read full article',
            searchQuery: 'Road Accident News'
        },
        weather: {
            title: 'Weather & Environment',
            desc: 'Real-time sensor data from ThingSpeak channels.',
            rainLevel: 'Rain Level',
            humidity: 'Humidity',
            airQuality: 'Air Quality',
            temperature: 'Temperature',
            heavyRain: 'Heavy Rain Detected',
            noRain: 'No Rain',
            good: 'Good',
            moderate: 'Moderate',
            live: 'Live',
            lastReadings: 'Last 10 Readings',
            sensorLocation: 'Sensor Location',
            mapPreview: 'Map Preview (Sensor Station)',
            status: {
                title: 'Weather Status',
                condition: 'Condition',
                windSpeed: 'Wind Speed',
                feelsLike: 'Feels Like',
                pressure: 'Pressure',
                fetchError: 'Failed to fetch weather data'
            }
        },
        chat: {
            title: 'AI Safety Assistant',
            subtitle: 'Ask for guidance, first aid tips, or safety protocols.',
            inputPlaceholder: 'Type your message...',
            thinking: 'Thinking...',
            initialMessage: 'Hello! I am your AI Safety Assistant. How can I help you with accident prevention or emergency guidelines today?',
            error: "Sorry, I couldn't connect to the AI service."
        }
    },
    ta: {
        sidebar: {
            dashboard: 'டாஷ்போர்டு',
            accidentSpot: 'விபத்து பகுதி',
            driverMonitor: 'ஓட்டுநர் கண்காணிப்பு',
            aiAssistant: 'AI உதவியாளர்',
            dailyNews: 'தினசரி செய்திகள்',
            weatherSensors: 'வானிலை & உணரிகள்',
            speedTracking: 'வேக கண்காணிப்பு',
            accidentCapture: 'விபத்து பதிவு',
            settings: 'அமைப்புகள்',
            weatherStatus: 'வானிலை நிலை',
            theme: 'தீம்',
            systemStatus: 'அமைப்பு நிலை:',
            online: 'ஆன்லைன்',
        },
        settings: {
            title: 'அமைப்பு அமைப்புகள்',
            description: 'எச்சரிக்கைகள் மற்றும் விருப்பங்களை கட்டமைக்கவும்.',
            appearance: 'தோற்றம்',
            themeMode: 'தீம் முறை',
            themeDesc: 'இருண்ட மற்றும் வெளிர் தீம்களுக்கு இடையில் மாறவும்',
            switchToDark: 'இருண்ட மோடுக்கு மாறு',
            switchToLight: 'வெளிர் மோடுக்கு மாறு',
            language: 'மொழி',
            selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
            languageDesc: 'உங்கள் விருப்பமான மொழியைத் தேர்வுசெய்க',
            safetyExtensions: 'பாதுகாப்பு நீட்டிப்புகள்',
            smsAlerts: 'SMS விழிப்பூட்டல்கள்',
            smsDesc: 'அவசர தொடர்புகளுக்கு தானாகவே SMS அனுப்பவும்',
            gpsTracking: 'பின்னணி GPS கண்காணிப்பு',
            gpsDesc: 'தத்தல்கள் மூடப்பட்டிருந்தாலும் வாகனத்தைக் கண்காணிக்கவும்',
            saveChanges: 'மாற்றங்களை சேமி',
            gmailNotifications: 'ஜிமெயில் அறிவிப்புகள்',
            gmailDesc: 'உங்கள் ஜிமெயில் இன்பாக்ஸிலிருந்து சமீபத்திய மின்னஞ்சலைக் காட்டு',
            connectGmail: 'ஜிமெயிலை இணைக்கவும்',
            gmailConnected: 'ஜிமெயில் இணைக்கப்பட்டது',
            noNewMail: 'புதிய அஞ்சல் இல்லை',
        },
        common: {
            loading: 'ஏற்றுகிறது...'
        },
        dashboard: {
            title: 'அவசரகால பதில் பலகை',
            subtitle: 'அவசர சேவைகள், இரத்த வங்கி தகவல், விபத்து அறிக்கையிடல் மற்றும் ஓட்டுநர் கண்காணிப்பு ஆகியவற்றை ஒரே இடத்தில் அணுகவும்.',
            emergencyCall: 'அவசர அழைப்பு',
            learnMore: 'மேலும் அறிய',
            cards: {
                accidentSpot: {
                    title: 'விபத்து பகுதி',
                    desc: 'விபத்துகளைப் புகாரளிக்கவும் மற்றும் அவசர சேவைகளை உங்கள் இடத்திற்கு வரவழைக்கவும்',
                    action: 'புகாரளி'
                },
                driverMonitoring: {
                    title: 'ஓட்டுநர் கண்காணிப்பு',
                    desc: 'ஓட்டுநர் நடத்தையைக் கண்காணிக்கவும் மற்றும் பாதுகாப்பற்ற ஓட்டுதலுக்கான எச்சரிக்கைகளைப் பெறவும்',
                    action: 'கண்காணி'
                },
                chat: {
                    title: 'எங்களுடன் அரட்டையடிக்கவும்',
                    desc: 'எங்கள் நேரலை அரட்டை ஆதரவு மூலம் உடனடி உதவியைப் பெறுங்கள்',
                    action: 'அரட்டை'
                }
            }
        },
        news: {
            title: 'தினசரி போக்குவரத்து & பாதுகாப்பு செய்திகள்',
            subtitle: 'சாலை பாதுகாப்பு குறித்த சமீபத்திய தகவல்களுடன் இணைந்திருங்கள்.',
            refresh: 'புதுப்பி',
            noNews: 'தற்போது செய்திகள் எதுவும் இல்லை.',
            readFull: 'முழு கட்டுரையைப் படியுங்கள்',
            searchQuery: 'சாலை விபத்து செய்திகள்'
        },
        weather: {
            title: 'வானிலை & சூழல்',
            desc: 'ThingSpeak சேனல்களிலிருந்து நிகழ்நேர சென்சார் தரவு.',
            rainLevel: 'மழை அளவு',
            humidity: 'ஈரப்பதம்',
            airQuality: 'காற்று தரம்',
            temperature: 'வெப்பநிலை',
            heavyRain: 'கனமழை கண்டறியப்பட்டது',
            noRain: 'மழை இல்லை',
            good: 'நன்று',
            moderate: 'மிதமான',
            live: 'நேரலை',
            lastReadings: 'கடைசி 10 அளவீடுகள்',
            sensorLocation: 'சென்சார் இருப்பிடம்',
            mapPreview: 'வரைபட முன்னோட்டம் (சென்சார் நிலையம்)',
            status: {
                title: 'வானிலை நிலை',
                condition: 'நிலை',
                windSpeed: 'காற்றின் வேகம்',
                feelsLike: 'உணர்வு',
                pressure: 'அழுத்தம்',
                fetchError: 'வானிலை தரவை எடுக்க முடியவில்லை'
            }
        },
        chat: {
            title: 'AI பாதுகாப்பு உதவியாளர்',
            subtitle: 'வழிகாட்டுதல், முதலுதவி குறிப்புகள் அல்லது பாதுகாப்பு நெறிமுறைகளைக் கேட்கவும்.',
            inputPlaceholder: 'உங்கள் செய்தியை உள்ளிடவும்...',
            thinking: 'யோசிக்கிறது...',
            initialMessage: 'வணக்கம்! நான் உங்கள் AI பாதுகாப்பு உதவியாளர். விபத்து தடுப்பு அல்லது அவசர வழிகாட்டுதல்களில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
            error: 'மன்னிக்கவும், AI சேவையுடன் இணைக்க முடியவில்லை.'
        }
    },
    hi: {
        sidebar: {
            dashboard: 'डैशबोर्ड',
            accidentSpot: 'दुर्घटना स्थल',
            driverMonitor: 'ड्राइवर निगरानी',
            aiAssistant: 'AI सहायक',
            dailyNews: 'दैनिक समाचार',
            weatherSensors: 'मौसम और सेंसर',
            speedTracking: 'गति ट्रैकिंग',
            accidentCapture: 'दुर्घटना कैप्चर',
            settings: 'सेटिंग्स',
            weatherStatus: 'मौसम की स्थिति',
            theme: 'थीम',
            systemStatus: 'सिस्टम स्थिति:',
            online: 'ऑनलाइन',
        },
        settings: {
            title: 'सिस्टम सेटिंग्स',
            description: 'अलर्ट, प्राथमिकताएं और सिस्टम पैरामीटर कॉन्फ़िगर करें।',
            appearance: 'दिखावट',
            themeMode: 'थीम मोड',
            themeDesc: 'लाइट और डार्क थीम के बीच स्विच करें',
            switchToDark: 'डार्क मोड में बदलें',
            switchToLight: 'लाइट मोड में बदलें',
            language: 'भाषा',
            selectLanguage: 'भाषा चुनें',
            languageDesc: 'अपनी पसंदीदा भाषा चुनें',
            safetyExtensions: 'सुरक्षा एक्सटेंशन',
            smsAlerts: 'SMS अलर्ट',
            smsDesc: 'आपातकालीन संपर्कों को स्वचालित रूप से SMS भेजें',
            gpsTracking: 'बैकग्राउंड GPS ट्रैकिंग',
            gpsDesc: 'टैब बंद होने पर भी वाहन को ट्रैक करें',
            saveChanges: 'परिवर्तन सहेजें',
            gmailNotifications: 'जीमेल सूचनाएं',
            gmailDesc: 'अपने जीमेल इनबॉक्स से नवीनतम ईमेल दिखाएं',
            connectGmail: 'जीमेल कनेक्ट करें',
            gmailConnected: 'जीमेल कनेक्ट हुआ',
            noNewMail: 'कोई नया मेल नहीं',
        },
        common: {
            loading: 'लोड हो रहा है...'
        },
        dashboard: {
            title: 'आपातकालीन प्रतिक्रिया डैशबोर्ड',
            subtitle: 'आपातकालीन सेवाओं, ब्लड बैंक की जानकारी, दुर्घटना रिपोर्टिंग और ड्राइवर निगरानी सभी एक ही जगह पर एक्सेस करें।',
            emergencyCall: 'आपातकालीन कॉल',
            learnMore: 'और जानें',
            cards: {
                accidentSpot: {
                    title: 'दुर्घटना स्थल',
                    desc: 'दुर्घटनाओं की रिपोर्ट करें और आपातकालीन सेवाओं को अपने स्थान पर भेजें',
                    action: 'रिपोर्ट करें'
                },
                driverMonitoring: {
                    title: 'ड्राइवर निगरानी',
                    desc: 'ड्राइवर के व्यवहार की निगरानी करें और असुरक्षित ड्राइविंग पैटर्न के लिए अलर्ट प्राप्त करें',
                    action: 'निगरानी करें'
                },
                chat: {
                    title: 'हमसे चैट करें',
                    desc: 'हमारी लाइव चैट सहायता प्रणाली के माध्यम से तत्काल सहायता प्राप्त करें',
                    action: 'अभी चैट करें'
                }
            }
        },
        news: {
            title: 'दैनिक यातायात और सुरक्षा समाचार',
            subtitle: 'नवीनतम सड़क सुरक्षा अपडेट के साथ अपडेट रहें।',
            refresh: 'समाचार रिफ्रेश करें',
            noNews: 'फिलहाल कोई खबर उपलब्ध नहीं है।',
            readFull: 'पूरा लेख पढ़ें',
            searchQuery: 'सड़क दुर्घटना समाचार'
        },
        weather: {
            title: 'मौसम और पर्यावरण',
            desc: 'ThingSpeak चैनलों से रीयल-टाइम सेंसर डेटा।',
            rainLevel: 'बारिश का स्तर',
            humidity: 'नमी',
            airQuality: 'वायु गुणवत्ता',
            temperature: 'तापमान',
            heavyRain: 'भारी बारिश का पता चला',
            noRain: 'बारिश नहीं',
            good: 'अच्छा',
            moderate: 'मध्यम',
            live: 'लाइव',
            lastReadings: 'पिछले 10 रीडिंग',
            sensorLocation: 'सेंसर का स्थान',
            mapPreview: 'मानचित्र पूर्वावलोकन (सेंसर स्टेशन)',
            status: {
                title: 'मौसम की स्थिति',
                condition: 'स्थिति',
                windSpeed: 'हवा की गति',
                feelsLike: 'महसूस होता है',
                pressure: 'दबाव',
                fetchError: 'मौसम डेटा प्राप्त करने में विफल'
            }
        },
        chat: {
            title: 'AI सुरक्षा सहायक',
            subtitle: 'मार्गदर्शन, प्राथमिक चिकित्सा सुझाव, या सुरक्षा प्रोटोकॉल के लिए पूछें।',
            inputPlaceholder: 'अपना संदेश टाइप करें...',
            thinking: 'सोच रहा है...',
            initialMessage: 'नमस्ते! मैं आपका AI सुरक्षा सहायक हूँ। दुर्घटना रोकथाम या आपातकालीन दिशानिर्देशों में मैं आपकी कैसे मदद कर सकता हूँ?',
            error: 'क्षमा करें, मैं AI सेवा से कनेक्ट नहीं हो सका।'
        }
    }
};
