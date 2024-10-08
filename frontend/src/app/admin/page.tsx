'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, View, Text, styled, YStack, Label, Input, XStack, Select, ToggleGroup } from 'tamagui';
import { House } from 'living-mile-high-lib';
import { useHouseQuery } from '@/contexts/HouseQueryContext';
import { Alert, AlertTitle, HouseQuery, HouseSortBy, HouseSortCriteria, PageConfig } from '@/types';
import { useServices } from '@/contexts/ServiceContext';
import { useAlert } from '@/contexts/AlertContext';
import { HouseQuerySortProvider } from '@/providers/houseQuerySortProvider';
import Pages from '@/config/pageConfig';
import { useHouseSort } from '@/contexts/HouseSortContext';

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
    justifyContent: 'center',
    marginBottom: 20,
    gap: 40,
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
});

const ToggleGroupItem = styled(ToggleGroup.Item, {
    variants: {
        active: {
            true: {
                backgroundColor: '$lightBg'
            },
            false: {
                backgroundColor: '$whiteBg'
            },
        },
    },
});

type PageConfigWithQueries = PageConfig & { queries: HouseQuery[] }
const QueryPages = Object.values(Pages).filter(page => page.queries !== undefined) as PageConfigWithQueries[]
const BooleanQueryToggles = Object.fromEntries(QueryPages.map(page => [page.name, page.queries]))

const AdminSorts: { [key: string]: HouseSortCriteria[] } = {
    "By Address": [{ sortBy: HouseSortBy.ADDRESS }],
    "By Priority": [{ sortBy: HouseSortBy.PRIORITY }],
    "Default Main Images (last)": [{ sortBy: HouseSortBy.NON_DEFAULT }],
    "Default Main Images (first)": [{ sortBy: HouseSortBy.NON_DEFAULT, reverse: true }],
    "Created At (newest)": [{ sortBy: HouseSortBy.CREATED_AT }],
    "Created At (oldest)": [{ sortBy: HouseSortBy.CREATED_AT, reverse: true }],
    "Updated At (newest)": [{ sortBy: HouseSortBy.UPDATED_AT }],
    "Updated At (oldest)": [{ sortBy: HouseSortBy.UPDATED_AT, reverse: true }],
}

const AdminPanel = () => {
    const router = useRouter();
    const { withAlertAsync } = useAlert();
    const { apiService } = useServices();
    const { houses: unsortedHouses, setHouseQueries } = useHouseQuery();
    const { sortHouses, setHouseSorts } = useHouseSort();
    const houses = useMemo(() => sortHouses(unsortedHouses), [unsortedHouses, sortHouses]);

    const [sortName, setSortName] = useState<string & keyof typeof AdminSorts>("By Address");
    const [addressContains, setAddressContains] = React.useState('');
    const [toggleKeys, setToggleKeys] = React.useState<string[]>([]);


    useEffect(() => {
        const reducedQueries = toggleKeys.reduce((acc, key) => acc.concat(BooleanQueryToggles[key]), [] as HouseQuery[]);
        const booleanQueries = toggleKeys.length === 0 ? [{}] : reducedQueries;
        const finalQueries = booleanQueries.map(q => ({ ...q, addressContains }));
        setHouseQueries(...finalQueries);
    }, [setHouseQueries, addressContains, toggleKeys]);

    useEffect(() => {
        setHouseSorts(...AdminSorts[sortName]);
    }, [setHouseSorts, sortName])

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
        setAddressContains(address);
    }

    const handleToggleValues = (values: string[]) => {
        setToggleKeys(values);
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

    const handleSortChange = (value: any) => {
        setSortName(value);
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
                <YStack alignItems='center'>
                    <FormLabel>Filter By Boolean</FormLabel>
                    <ToggleGroup
                        orientation='horizontal'
                        type='multiple'
                        onValueChange={handleToggleValues}
                    >
                        {Object.keys(BooleanQueryToggles).map(key => (
                            <ToggleGroupItem
                                key={key}
                                value={key}
                                active={toggleKeys.includes(key)}
                            >
                                {key}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </YStack>
                <YStack>
                    <FormLabel>Sort by:</FormLabel>
                    <Select value={sortName} onValueChange={handleSortChange} disablePreventBodyScroll>
                        <Select.Trigger>
                            <Select.Value placeholder="Select an option" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Viewport>
                                {Object.keys(AdminSorts).map((key, index) => (
                                    <Select.Item key={key} index={index} value={key}>
                                        <Select.ItemText>{key}</Select.ItemText>
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
        <HouseQuerySortProvider>
            <AdminPanel />
        </HouseQuerySortProvider>
    )
}

export default AdminPage;