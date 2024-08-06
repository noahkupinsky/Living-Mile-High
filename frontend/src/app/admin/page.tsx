'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, View, Text, styled, YStack, Label, Input, XStack, Select } from 'tamagui';
import services from '@/di';
import { House } from 'living-mile-high-lib';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { Alert, AlertTitle, HouseSort } from '@/types';
import { useServices } from '@/contexts/ServiceContext';
import { useAlert } from '@/contexts/AlertContext';

const COLUMNS = 2; // Define the number of columns here

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

const MainButtonsContainer = styled(XStack, {
    justifyContent: 'center',
    gap: 10,
})

const QueryContainer = styled(XStack, {
    justifyContent: 'space-between',
    marginBottom: 20,
})

const HouseButtonArea = styled(YStack, {
    justifyContent: 'flex-end',
    gap: 5, // Adjusted for smaller padding between buttons
});

const StyledButton = styled(Button, {
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

const FormLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const FormLabelText = styled(Label, {
    marginBottom: 5,
    fontWeight: 'bold',
});

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <FormLabelContainer>
        <FormLabelText>{children}</FormLabelText>
    </FormLabelContainer>
)

const TextInput = styled(Input, {
    flex: 1,
});

const AdminPanel = () => {
    const router = useRouter();
    const { withAlertAsync } = useAlert();
    const { apiService } = useServices();
    const { houses, setQuery, sort, setSort } = useHouseQuery();

    useEffect(() => {
        setQuery({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = (id: string) => {
        router.push(`admin/upsert-house?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this house?");
        if (!confirmed) return;

        await withAlertAsync(async () => {
            try {
                await apiService.deleteHouse(id);
                return new Alert(AlertTitle.SUCCESS, "House deleted successfully.");
            } catch (error) {
                return new Alert(AlertTitle.ERROR, `Failed to delete house: ${error}`);
            }
        })
    };

    const handleAddressQuery = (address: string) => {
        setQuery(query => ({ ...query, addressContains: address }));
    }

    const handleDangerZone = () => {
        router.push('/admin/danger-zone');
    }

    const handleGeneralData = () => {
        router.push('/admin/general');
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

    const handleSortChange = (value: HouseSort) => {
        setSort(value);
    };

    const columns = getColumns(houses);

    return (
        <YStack justifyContent="center" alignItems="center">
            <MainButtonsContainer>
                <Button marginBottom={20} color="blue" onPress={handleGeneralData}>
                    Edit General Data
                </Button>
                <Button color="#0a8" onPress={handleCreateNew}>
                    Create New House
                </Button>
                <Button color="red" onPress={handleDangerZone}>
                    Danger Zone
                </Button>
            </MainButtonsContainer>
            <QueryContainer width={'70%'}>
                <YStack>
                    <FormLabel>Filter By Address</FormLabel>
                    <TextInput
                        placeholder="Enter address"
                        onChangeText={handleAddressQuery}
                    />
                </YStack>
                <YStack>
                    <FormLabel>Sort by:</FormLabel>
                    <Select value={sort} onValueChange={handleSortChange} disablePreventBodyScroll>
                        <Select.Trigger>
                            <Select.Value placeholder="Select an option" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Viewport>
                                {Object.entries(HouseSort).map(([key, value], index) => (
                                    <Select.Item key={key} index={index} value={value}>
                                        <Select.ItemText>{value}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select>
                </YStack>
            </QueryContainer>
            <ListContainer>
                {columns.map((column, columnIndex) => (
                    <ColumnContainer key={columnIndex}>
                        {column.map(house => (
                            <HouseItem key={house.id!}>
                                <HouseAddress>{house.address}</HouseAddress>
                                <HouseButtonArea>
                                    <StyledButton onPress={() => handleEdit(house.id!)}>Edit</StyledButton>
                                    <StyledButton color="red" onPress={() => handleDelete(house.id!)}>Delete</StyledButton>
                                </HouseButtonArea>
                            </HouseItem>
                        ))}
                    </ColumnContainer>
                ))}
            </ListContainer>
        </YStack>
    );
};

const AdminPage = () => {
    return (
        <HouseQueryProvider>
            <AdminPanel />
        </HouseQueryProvider>
    )
}

export default AdminPage;