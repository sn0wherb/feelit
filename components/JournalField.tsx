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
    const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
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
                {selectedPeople.includes(item) && (
                    <View style={{ position: "absolute", zIndex: 1, elevation: 1, top: 0, right: 0, backgroundColor: "rgba(227, 215, 183, 0.8)", padding: 4, borderRadius: 100, height: 24, width: 24, justifyContent: "center", alignItems: "center" }}>
                        <FontAwesome6 name="check" size={16} color="black" />
                    </View>
                )}
                <TouchableOpacity style={{ backgroundColor: item.color, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20,
                    borderWidth: 3,
                    borderColor: item.selected ? 'rgba(227, 215, 183, 0.8)' : "transparent"
                    }}
                    onPress={() => {
                    if (selectedPeople.includes(item)) {
                        setSelectedPeople(selectedPeople.filter(person => person.id !== item.id));
                    } else {
                        setSelectedPeople([...selectedPeople, item]);
                    }
                    }}
                    >
                    <Text style={{fontSize: 16}}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderSelectedPerson = ({ item, index }: { item: PersonType, index: number }) => {
        return (
            <View style={{ backgroundColor: item.color, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20}}>
                <Text style={{fontSize: 16}}>{item.name}</Text>
            </View>
        )
    }
    useFocusEffect(
        useCallback(() => {
            getPeople();
        }, [])
    )

    if (isPersonModalOpen) {
        return (
            <View style={{width: width, height: height, position: "absolute", zIndex: 1, elevation: 1, top: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={() => setIsPersonModalOpen(false)} style={{position: "absolute", zIndex: 2, elevation: 2, top: 6, right: 28, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(197, 182, 145)", padding: 4, borderRadius: 100, 
                    height: 40, width: 40}}>
                    <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
            <View style={{width: width * 0.8, position: "absolute", zIndex: 1, elevation: 1, top: height * 0.02, backgroundColor: "rgba(227, 215, 183, 1)", height: height * 0.64, alignSelf: 'center', borderRadius: 20, padding: 10}}>
                <FlatList
                    contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                    scrollEnabled={false}
                    data={people}
                    renderItem={renderPerson}
                />
            </View>
            </View>
        );
    }

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
                    <Text style={{ fontSize: 19, }}>{title}</Text>
                </View>
                {type === 'text' ? (<View>
                    {!isOpen ? (
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
                    ) : (
                        <View style={{padding: 10}}>
                            <TouchableOpacity onPress={() => setIsOpen(false)} style={{position: "absolute", zIndex: 2, elevation: 2, top: 0, right: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(224, 209, 172)", padding: 4, borderRadius: 100, 
                    height: 30, width: 30}}>
                    <AntDesign name="close" size={20} color="black" />
                </TouchableOpacity>
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
                    )}
                    </View>
                ) : (
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        {selectedPeople.length > 0 && <FlatList
                            scrollEnabled={false}
                            data={selectedPeople}
                            renderItem={renderSelectedPerson}
                            contentContainerStyle={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}
                        />}
                        <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: 10,}}
                        onPress={() => {
                            setIsPersonModalOpen(true);
                            // router.push("/personSelectionModal");
                        }}
                    >
                        <AntDesign name="plus" size={18} color={"black"} />
                    </TouchableOpacity>
                    </View>
                )}
            </View>
    );

    if (!isOpen) {
        if (type === "text") {
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
        } else {
            return (
                <View style={{ width: width, padding: 20, gap: 10, alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>
                    {title}
                </Text>
                <View style={{ paddingVertical: 8}}>
                    <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 20 }}
                        onPress={() => {
                            setIsOpen(true);
                        }}
                    >
                        <AntDesign name="plus" size={18} color={"black"} />
                    </TouchableOpacity>
                </View>
            </View>
            )
        }
    }

    if (type === "text") {
        // Text field
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
    } else {
        // Selection field
        return (
            <View>
                <Text>Person Selection Field</Text>
            </View>
        )
    }

}

export default JournalField;
