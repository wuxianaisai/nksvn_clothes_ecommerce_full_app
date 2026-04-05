import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";

export default function Addresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Состояние формы
    const [type, setType] = useState("Home");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Состояние редактирования
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setAddresses(dummyAddress as any);
        setLoading(false);
    };

    const handleEditSearch = (item: Address) => {
        setIsEditing(true);
        setEditingId(item._id);
        setType(item.type);
        setStreet(item.street);
        setCity(item.city);
        setState(item.state);
        setZipCode(item.zipCode);
        setCountry(item.country);
        setIsDefault(item.isDefault);
        setModalVisible(true);
    };

    const handleSaveAddress = async () => {
        setModalVisible(false);
        resetForm();
        fetchAddresses();
    };

    const handleDeleteAddress = async (id: string) => {

    };

    const resetForm = () => {
        setStreet("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
        setType("Home");
        setIsDefault(false);
        setIsEditing(false);
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
            <Header title="Адреса доставки" showBack />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView className="flex-1 px-4 pt-4">
                    {addresses.length === 0 ? (
                        <Text className="text-center text-secondary mt-10">Адреса не найдены</Text>
                    ) : (
                        addresses.map((item) => (
                            <View key={item._id} className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                                <View className="flex-row items-center justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name={item.type === "Home" ? "home-outline" : "briefcase-outline"}
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                        <Text className="text-base font-bold text-primary ml-2">
                                            {item.type === "Home" ? "Дом" : item.type === "Work" ? "Работа" : "Другое"}
                                        </Text>
                                        {item.isDefault && (
                                            <View className="bg-primary/10 px-2 py-1 rounded ml-2">
                                                <Text className="text-primary text-xs font-bold">По умолчанию</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-4">
                                        <TouchableOpacity onPress={() => handleEditSearch(item)}>
                                            <Ionicons name="pencil-outline" size={20} color={COLORS.secondary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteAddress(item._id)}>
                                            <Ionicons name="trash-outline" size={20} color={COLORS.error || '#ff4444'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text className="text-secondary leading-5 ml-7">
                                    {item.street}, {item.city}, {item.state} {item.zipCode}, {item.country}
                                </Text>
                            </View>
                        ))
                    )}

                    <TouchableOpacity 
                        className="flex-row items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl mt-2 mb-8" 
                        onPress={openAddModal}
                    >
                        <Ionicons name="add" size={24} color={COLORS.secondary} />
                        <Text className="text-secondary font-medium ml-2">Добавить новый адрес</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* Модальное окно добавления адреса */}
            <Modal 
                animationType="slide" 
                transparent={true} 
                visible={modalVisible} 
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[85%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-primary">
                                {isEditing ? "Редактировать адрес" : "Добавить новый адрес"}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text className="text-primary font-medium mb-2">Тип адреса</Text>
                            <View className="flex-row gap-3 mb-4">
                                {[
                                    { label: "Дом", value: "Home" },
                                    { label: "Работа", value: "Work" },
                                    { label: "Другое", value: "Other" }
                                ].map((t) => (
                                    <TouchableOpacity 
                                        key={t.value} 
                                        onPress={() => setType(t.value)} 
                                        className={`px-4 py-2 rounded-full border ${type === t.value ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={type === t.value ? 'text-white' : 'text-primary'}>{t.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text className="text-primary font-medium mb-2">Улица, дом</Text>
                            <TextInput 
                                className="bg-surface p-4 rounded-xl text-primary mb-4" 
                                placeholder="ул. Пушкина, д. 10" 
                                value={street} 
                                onChangeText={setStreet} 
                            />

                            <View className="flex-row gap-4 mb-4">
                                <View className="flex-1">
                                    <Text className="text-primary font-medium mb-2">Город</Text>
                                    <TextInput 
                                        className="bg-surface p-4 rounded-xl text-primary" 
                                        placeholder="Москва" 
                                        value={city} 
                                        onChangeText={setCity} 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-primary font-medium mb-2">Область</Text>
                                    <TextInput 
                                        className="bg-surface p-4 rounded-xl text-primary" 
                                        placeholder="Московская обл." 
                                        value={state} 
                                        onChangeText={setState} 
                                    />
                                </View>
                            </View>

                            <View className="flex-row gap-4 mb-4">
                                <View className="flex-1">
                                    <Text className="text-primary font-medium mb-2">Индекс</Text>
                                    <TextInput 
                                        className="bg-surface p-4 rounded-xl text-primary" 
                                        placeholder="101000" 
                                        value={zipCode} 
                                        onChangeText={setZipCode} 
                                        keyboardType="numeric" 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-primary font-medium mb-2">Страна</Text>
                                    <TextInput 
                                        className="bg-surface p-4 rounded-xl text-primary" 
                                        placeholder="Россия" 
                                        value={country} 
                                        onChangeText={setCountry} 
                                    />
                                </View>
                            </View>

                            <TouchableOpacity 
                                className="flex-row items-center mb-8" 
                                onPress={() => setIsDefault(!isDefault)}
                            >
                                <View className={`w-5 h-5 border rounded mr-2 items-center justify-center ${isDefault ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {isDefault && <Ionicons name="checkmark" size={14} color="white" />}
                                </View>
                                <Text className="text-primary">Использовать как адрес по умолчанию</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                className="w-full bg-primary py-4 rounded-full items-center mb-10" 
                                onPress={handleSaveAddress} 
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Сохранить адрес</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}