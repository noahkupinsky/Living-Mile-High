// pages/house-list.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, View, Text, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';

const ListContainer = styled(View, {
    padding: 20,
});

const HouseItem = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
});

const HouseList: React.FC = () => {
    const router = useRouter();
    const { houses } = useSiteData();

    const handleEdit = (id: string) => {
        router.push(`admin/upsert-house?id=${id}`);
    };

    return (
        <ListContainer>

            {houses.map(house => (
                <HouseItem key={house.id!}>
                    <Text>{house.address}</Text>
                    <Button onPress={() => handleEdit(house.id!)}>Edit</Button>
                </HouseItem>
            ))}
        </ListContainer>
    );
};

export default HouseList;