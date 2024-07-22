'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, View, Text, styled, YStack } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import services from '@/di';
import { House } from 'living-mile-high-lib';

const COLUMNS = 3; // Define the number of columns here

const ListContainer = styled(View, {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
});

const ColumnContainer = styled(View, {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
});


export const ButtonArea = styled(YStack, {
    justifyContent: 'flex-end',
    gap: 5, // Adjusted for smaller padding between buttons
});

export const StyledButton = styled(Button, {
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    size: 20
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

const HouseAddress = styled(Text, {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 50,
});

const AdminPanel = () => {
    const router = useRouter();
    const { houses, deleteHouse } = useSiteData();

    const handleEdit = (id: string) => {
        router.push(`admin/upsert-house?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this house?");
        if (!confirmed) return;

        try {
            await deleteHouse(id);
            alert(`House deleted successfully.`);
            // Optionally, you can refresh the house list after deletion
        } catch (error) {
            alert(`An error occurred while deleting the house with ID: ${id}. Please try again.`);
        }
    };

    const handleDangerZone = () => {
        router.push('/admin/danger-zone');
    }

    const handleCreateNew = () => {
        router.push('admin/upsert-house');
    };

    const getColumns = (houses: House[]) => {
        const columns: House[][] = Array.from({ length: COLUMNS }, () => []);
        houses.forEach((house, index) => {
            columns[index % COLUMNS].push(house);
        });
        return columns;
    };

    const columns = getColumns(houses);

    return (
        <YStack justifyContent="center" alignItems="center">
            <Button color="#0a8" onPress={handleCreateNew}>
                Create New House
            </Button>
            <ListContainer>
                {columns.map((column, columnIndex) => (
                    <ColumnContainer key={columnIndex}>
                        {column.map(house => (
                            <HouseItem key={house.id!}>
                                <HouseAddress>{house.address}</HouseAddress>
                                <ButtonArea>
                                    <StyledButton onPress={() => handleEdit(house.id!)}>Edit</StyledButton>
                                    <StyledButton color="red" onPress={() => handleDelete(house.id!)}>Delete</StyledButton>
                                </ButtonArea>
                            </HouseItem>
                        ))}
                    </ColumnContainer>
                ))}
            </ListContainer>

            <Button color="red" onPress={handleDangerZone}>
                Danger Zone
            </Button>
        </YStack>
    );
};

export default AdminPanel;