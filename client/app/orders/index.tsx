import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS, getStatusColor } from "@/constants";
import type { Order } from "@/constants/types";
import { dummyOrders, formatDate } from "@/assets/assets";

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setOrders(dummyOrders as any[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Функция перевода статуса заказа
    const getStatusText = (status: string) => {
        switch (status) {
            case 'placed': return 'Оформлен';
            case 'processing': return 'В обработке';
            case 'shipped': return 'Отправлен';
            case 'delivered': return 'Доставлен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    // Функция перевода статуса оплаты
    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case 'paid': return 'Оплачен';
            case 'pending': return 'Ожидает оплаты';
            case 'failed': return 'Ошибка оплаты';
            case 'refunded': return 'Возвращен';
            default: return status;
        }
    };

    // Функция перевода способа оплаты
    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case 'card': return 'Карта';
            case 'cash': return 'Наличные';
            case 'online': return 'Онлайн';
            default: return method;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
            <Header title="Мои заказы" showBack />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : orders.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-secondary text-lg">Заказы не найдены</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm"
                            onPress={() => router.push(`/orders/${item._id}`)}
                        >
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-primary font-bold">Заказ №{item.orderNumber}</Text>
                                <Text className="text-secondary text-sm">{formatDate(item.createdAt)}</Text>
                            </View>

                            {/* Статусы */}
                            <View className="flex-row gap-2 mb-3">
                                <View className={`px-2 py-1 rounded-full ${getStatusColor(item.orderStatus)}`}>
                                    <Text className={`text-xs font-bold capitalize`}>
                                        {getStatusText(item.orderStatus)}
                                    </Text>
                                </View>

                                <View className={`px-2 py-1 rounded-full ${item.paymentStatus === 'paid' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                    <Text className={`text-xs font-bold capitalize ${item.paymentStatus === 'paid' ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                        {getPaymentStatusText(item.paymentStatus)}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-secondary text-xs">Способ оплаты: <Text className="text-primary font-medium capitalize">{getPaymentMethodText(item.paymentMethod)}</Text></Text>
                            </View>

                            {/* Изображения товаров */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                                {item.items.map((prod: any, idx) => {
                                    const image = prod.product?.images?.[0];
                                    return (
                                        <View key={idx} className="mr-3 border border-gray-100 rounded-md p-1 bg-gray-50">
                                            {image ? (
                                                <Image
                                                    source={{ uri: image }}
                                                    className="w-12 h-12 rounded-md"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-12 h-12 bg-gray-200 rounded-md justify-center items-center">
                                                    <Ionicons name="image-outline" size={20} color={COLORS.secondary} />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
                                <Text className="text-secondary">Товаров: {item.items.length}</Text>
                                <Text className="text-primary font-bold text-lg">{item.totalAmount.toFixed(2)} ₽</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}