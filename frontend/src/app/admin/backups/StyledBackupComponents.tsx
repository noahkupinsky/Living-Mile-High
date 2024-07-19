import { styled } from 'tamagui';
import { Stack, Text, Input, Button, XStack, YStack, ListItem } from 'tamagui';

export const PageContainer = styled(Stack, {
    space: 'lg',
});

export const Title = styled(Text, {
    fontSize: 18,
    fontWeight: 'bold',
});

export const FullWidthInput = styled(Input, {
    flex: 1,
});

export const BackupListItem = styled(ListItem, {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
});

export const TitleArea = styled(XStack, {
    flex: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 1,
});

export const ButtonArea = styled(YStack, {
    justifyContent: 'flex-end',
    gap: 5, // Adjusted for smaller padding between buttons
});

export const StyledButton = styled(Button, {
    borderRadius: 8,
    padding: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    size: 20
});

export const SectionContainer = styled(Stack, {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
});

export const SectionTitle = styled(Text, {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
});

export const StyledInput = styled(Input, {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
});

export const CreateButton = styled(Button, {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
});