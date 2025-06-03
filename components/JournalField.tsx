import { uncapitalise } from "@/assets/functions";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    title: string;
    placeholder?: string;
    value: string;
    // onChangeText: (text: string) => void;
    currentEmotion: EmotionType;
    type?: "selection" | "text";
}

type PersonType = {
    id: number;
    name: string;
    color: string;
    selected: boolean;
}

const { width, height } = Dimensions.get("window");

const JournalField = ({ title, placeholder, value, currentEmotion, type = 'text' }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const db = useSQLiteContext();
    const [people, setPeople] = useState<PersonType[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<PersonType[]>([]);

    // Functions
    const getPeople = async () => {
        const people = await db.getAllAsync<PersonType>("SELECT * FROM people");
        setPeople([...people, { id: 0, name: "Add new person", color: "white", selected: false }]);
    }

    const createPerson = () => {
        router.push("/createPerson");
    }

    const renderPerson = ({ item, index }: { item: PersonType, index: number }) => {
        if (index === people.length - 1) {
            return (
                <View style={{ paddingVertical: 8}}>
                    <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 20 }}
                        onPress={() => {
                            createPerson();
                        }}
                    >
                        <AntDesign name="plus" size={18} color={"black"} />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={{ paddingVertical: 8}}>
                {item.selected && (
                    <View style={{ position: "absolute", zIndex: 1, elevation: 1, top: 0, right: 0, backgroundColor: "rgba(227, 215, 183, 0.8)", padding: 4, borderRadius: 100, height: 24, width: 24, justifyContent: "center", alignItems: "center" }}>
                        <FontAwesome6 name="check" size={16} color="black" />
                    </View>
                )}
                <TouchableOpacity style={{ backgroundColor: item.color, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20,
                    borderWidth: 3,
                    borderColor: item.selected ? 'rgba(227, 215, 183, 0.8)' : "transparent"
                    }}
                    onPress={() => {
                    if (item.selected) {
                        setSelectedPeople(selectedPeople.filter(person => person.id !== item.id));
                        setPeople(people.map(person => ({ ...person, selected: person.id !== item.id })));
                    } else {
                        setSelectedPeople([...selectedPeople, item]);
                        setPeople(people.map(person => ({ ...person, selected: person.id === item.id })));
                    }
                    }}
                    >
                    <Text style={{fontSize: 16}}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    useFocusEffect(
        useCallback(() => {
            getPeople();
        }, [])
    )

    if (type === "selection") {
        return (
            <View style={{ width: width, padding: 20, gap: 10, alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>
                    {title}
                </Text>
                <FlatList
                    contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                    scrollEnabled={false}
                    data={people}
                    renderItem={renderPerson}
                />
            </View>
        )
    }

    if (!isOpen) {
        return (
            <View
                style={{
                width: width,
                // flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                gap: 20,
                }}
            >
                <View>
                    <Text style={{ fontSize: 18 }}>{title}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        borderRadius: 100,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        height: height * 0.08,
                        width: height * 0.08,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => setIsOpen(true)}
                >
                    <AntDesign name="plus" size={28} color={"black"} />
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <View style={{ width: width, padding: 20, gap: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>
                {title}
            </Text>
            <TextInput
                multiline={true}
                numberOfLines={10}
                placeholder={"Type here..."}
                placeholderTextColor="#555"
            //   onChangeText={(value) => {
            //     passDiaryData("root", value);
            //   }}
                style={{
                width: 320,
                minHeight: 60,
                height: "auto",
                padding: 10,
                marginTop: 6,
                fontSize: 16,
                borderRadius: 10,
                backgroundColor: String(currentEmotion.color),
                // Shadow
                shadowColor: String(currentEmotion.color),
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                }}
            />
        </View>
    );

}

export default JournalField;
