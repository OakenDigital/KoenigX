import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {CollectionCard} from '../components/ui/cards/CollectionCard';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function CollectionNodeComponent({
    collection,
    columns,
    layout,
    nodeKey,
    postCount,
    headerTextEditor,
    headerTextEditorInitialState
}) {
    const [editor] = useLexicalComposerContext();
    const [isLoading, setIsLoading] = React.useState(false);
    const {isEditing, isSelected, setEditing} = React.useContext(CardContext);
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);
    const [posts, setPosts] = React.useState([]);

    // fetch collection posts on mount
    React.useEffect(() => {
        if (cardConfig?.fetchCollectionPosts && collection?.slug) {
            fetchCollectionPosts(collection?.slug);
        }
    }, []);

    React.useEffect(() => {
        headerTextEditor.setEditable(isEditing);
    }, [isEditing, headerTextEditor]);

    const fetchCollectionPosts = async (collectionSlug) => {
        setIsLoading(true);
        const response = await cardConfig?.fetchCollectionPosts(collectionSlug);
        setPosts(response);
        setIsLoading(false);
    };

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    const handleCollectionChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.collection = {slug: value};
        });
        fetchCollectionPosts(value);
    };

    const handleLayoutChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.layout = value;
        });
    };

    const handleColumnChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.columns = parseInt(value);
        });
    };

    const handlePostCountChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.postCount = value;
        });
    };

    return (
        <>
            <CollectionCard
                collection={collection}
                columns={columns}
                handleCollectionChange={handleCollectionChange}
                handleColumnChange={handleColumnChange}
                handleLayoutChange={handleLayoutChange}
                handlePostCountChange={handlePostCountChange}
                headerTextEditor={headerTextEditor}
                headerTextEditorInitialState={headerTextEditorInitialState}
                isEditing={isEditing}
                isLoading={isLoading}
                layout={layout}
                postCount={postCount}
                posts={posts}
            />
            <ActionToolbar
                data-kg-card-toolbar="collection"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="collection"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-collection-card" icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator hide={!cardConfig.createSnippet} />
                    <ToolbarMenuItem
                        dataTestId="create-snippet"
                        hide={!cardConfig.createSnippet}
                        icon="snippet"
                        isActive={false}
                        label="Create snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}