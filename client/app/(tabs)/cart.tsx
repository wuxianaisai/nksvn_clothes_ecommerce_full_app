import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem"

export default function Cart() {

    const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart()
    const router = useRouter()

    const shipping = 80;
    const total = cartTotal + shipping;

    const getProductWord = (count: number) => {
        if (count % 10 === 1 && count % 100 !== 11) return 'товар';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
        return 'товаров';
    }

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
            <Header title="Корзина" showBack />
            {cartItems.length > 0 ? (
                <>
                    <ScrollView className="flex-1 px-4 mt-4"
                        showsVerticalScrollIndicator={false}>
                        {cartItems.map((item, index) => (
                            <CartItem key={index}
                                item={item}
                                onRemove={() => removeFromCart(item.id, item.size)}
                                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)} />
                        ))}
                    </ScrollView>

                    <View className="p-4 bg-white rounded-t 3xl shadow-sm">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-secondary">{cartItems.length} {getProductWord(cartItems.length)}:</Text>
                            <Text className="text-primary font-bold">{cartTotal} ₽</Text>

                        </View>

                        <View className="flex-row justify-between mb-2">
                            <Text className="text-secondary">Доставка:</Text>
                            <Text className="text-primary font-bold">{shipping} ₽</Text>
                        </View>

                        <View className="h-[1px] bg-border mb-4" />

                        <View className="flex-row justify-between mb-6">
                            <Text className="text-primary font-bold text-lg">
                                Итог:
                            </Text>
                            <Text className="text-primary font-bold text-lg">
                                {total} ₽
                            </Text>
                        </View>

                        <TouchableOpacity className="bg-primary py-4 rounded-full items-center" onPress={() => router.push("/checkout")}>
                            <Text className="text-white font-bold text-base">К оформлению</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-secondary text-lg">Ваша корзина пуста</Text>
                    <TouchableOpacity onPress={() => router.push("/")}
                        className="mt-4">
                        <Text className="text-primary font-bold">Начать покупки</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}