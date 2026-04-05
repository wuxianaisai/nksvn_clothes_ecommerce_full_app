import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types"
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {

    const { cartTotal, cartItems } = useCart()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

    const shipping = 80;
    const tax = 0

    const total = cartTotal + shipping + tax;

    const getProductWord = (count: number) => {
        if (count % 10 === 1 && count % 100 !== 11) return 'товар';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
        return 'товаров';
    }

    const fetchAddress = async () => {
        const addrList = dummyAddress;
        if (addrList.length > 0) {
            const def = addrList.find((a: any) => a.isDefault) || addrList[0]
            setSelectedAddress(def as Address)
        }
        setPageLoading(false)
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Toast.show({
                type: "error",
                text1: "Ошибка",
                text2: "Пожалуйста, укажите адрес доставки"
            })
            return;
        }

        if (paymentMethod === "stripe")
            return Toast.show({
                type: "error",
                text1: "info",
                text2: "Stripe not implementd yet"
            })

        router.replace("/orders")
    }

    useEffect(() => {
        fetchAddress()
    }, [])

    if (pageLoading) {
        return (
            <SafeAreaView flex-1 bg-surface justify-center items-center>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
            <Header title="Заказ" showBack />

            <ScrollView className="flex-1 px-4 mt-4">
                <Text className="text-lg font-bold text-primary mb-4">Адрес доставки</Text>
                {selectedAddress ? (
                    <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-base font-bold">{selectedAddress.type}</Text>
                            <TouchableOpacity onPress={() => router.push("/addresses")}>
                                <Text className="text-accent text-sm">Изменить</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-secondary leading-5">
                            {selectedAddress.street},
                            {selectedAddress.city},
                            {"\n"}
                            {selectedAddress.state},
                            {selectedAddress.zipCode},
                            {"\n"}
                            {selectedAddress.country}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => router.push("/addresses")}
                        className="bg-white p-6 rounded-xl mb-6 items-center
                     justify-center border-dashed border-2 border-gray-100">
                        <Text className="text-primary font-bold">Добавить адрес</Text>
                    </TouchableOpacity>
                )}

                <Text className="text-lg font-bold text-primary mb-4">Способ оплаты</Text>

                <TouchableOpacity
                onPress={() => setPaymentMethod("cash")}
                className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "cash" ? "border-primary" : "border-transparent"}`}>
                    <Ionicons name="cash-outline" size={24} color={COLORS.primary} className="mr-3" />
                    <View className="ml-3 flex-1">
                        <Text className="text-base font-bold text-primary">Оплата наличными</Text>
                        <Text className="text-secondary text-xs mt-1">Оплати, когда получишь товар</Text>
                    </View>
                    {paymentMethod === "cash" && 
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
                </TouchableOpacity>


                <TouchableOpacity
                onPress={() => setPaymentMethod("stripe")}
                className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "stripe" ? "border-primary" : "border-transparent"}`}>
                    <Ionicons name="card-outline" size={24} color={COLORS.primary} className="mr-3" />
                    <View className="ml-3 flex-1">
                        <Text className="text-base font-bold text-primary">Оплата картой</Text>
                        <Text className="text-secondary text-xs mt-1">Оплати товар сразу кредитной или дебетовой картой</Text>
                    </View>
                    {paymentMethod === "stripe" && 
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
                </TouchableOpacity>
            </ScrollView>

            <View className="p-4 bg-white shadow-lg border-t border-gray-100">
                <Text className="text-lg font-bold text-primary mb-4">Итого:</Text>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-secondary">{cartItems.length} {getProductWord(cartItems.length)}:</Text>
                    <Text className="font-bold">{cartTotal} ₽</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-secondary">Доставка:</Text>
                    <Text className="font-bold">{shipping} ₽</Text>
                </View>

                <View className="flex-row justify-between mb-4">
                    <Text className="text-secondary">Налог:</Text>
                    <Text className="font-bold">{tax} ₽</Text>
                </View>

                <View className="flex-row justify-between mb-6">
                    <Text className="text-primary text-xl font-bold">К оплате:</Text>
                    <Text className="text-primary text-xl font-bold">{total} ₽</Text>
                </View>

                <TouchableOpacity
                onPress={handlePlaceOrder} disabled={loading}
                className={`p-4 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-primary"}`}>
                    {loading ? <ActivityIndicator color="white" /> : 
                    <Text className="text-white font-bold text-lg">Заказать</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}