import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {ButtonGroupSetting, ColorPickerSetting, InputSetting, MediaUploadSetting, MultiSelectDropdownSetting, SettingsDivider, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {ReactComponent as CenterAlignIcon} from '../../../assets/icons/kg-align-center.svg';
import {FastAverageColor} from 'fast-average-color';
import {ReactComponent as ImgFullIcon} from '../../../assets/icons/kg-img-full.svg';
import {ReactComponent as ImgRegularIcon} from '../../../assets/icons/kg-img-regular.svg';
import {ReactComponent as ImgWideIcon} from '../../../assets/icons/kg-img-wide.svg';
import {ReactComponent as LayoutSplitIcon} from '../../../assets/icons/kg-layout-split.svg';
import {ReactComponent as LeftAlignIcon} from '../../../assets/icons/kg-align-left.svg';
import {SubscribeForm} from '../SubscribeForm';
import {getAccentColor} from '../../../utils/getAccentColor';
import {isEditorEmpty} from '../../../utils/isEditorEmpty';
import {textColorForBackgroundColor} from '@tryghost/color-utils';

export function SignupCard({alignment,
    header,
    subheader,
    disclaimer,
    buttonText,
    showBackgroundImage,
    backgroundImageSrc,
    backgroundColor,
    buttonColor,
    isEditing,
    fileUploader,
    handleAlignment,
    handleButtonText,
    handleToggleBackgroundImage,
    handleClearBackgroundImage,
    handleBackgroundColor,
    handleButtonColor,
    handleLayout,
    labels,
    layout,
    availableLabels,
    handleLabels,
    onFileChange,
    imageDragHandler,
    headerTextEditor,
    headerTextEditorInitialState,
    subheaderTextEditor,
    subheaderTextEditorInitialState,
    disclaimerTextEditor,
    disclaimerTextEditorInitialState}) {
    const [backgroundImageAverageColor, setBackgroundImageAverageColor] = useState(null);

    useEffect(() => {
        if (backgroundImageSrc) {
            new FastAverageColor().getColorAsync(backgroundImageSrc).then((color) => {
                setBackgroundImageAverageColor(color.hex);
            });
        }
    }, [backgroundImageSrc]);

    const layoutChildren = [
        {
            label: 'Regular',
            name: 'regular',
            Icon: ImgRegularIcon
        },
        {
            label: 'Wide',
            name: 'wide',
            Icon: ImgWideIcon
        },
        {
            label: 'Full',
            name: 'full',
            Icon: ImgFullIcon
        },
        {
            label: 'Split',
            name: 'split',
            Icon: LayoutSplitIcon
        }
    ];

    const alignmentChildren = [
        {
            label: 'Left',
            name: 'left',
            Icon: LeftAlignIcon
        },
        {
            label: 'Center',
            name: 'center',
            Icon: CenterAlignIcon
        }
    ];

    const {isLoading: isUploading, progress} = fileUploader || {};

    const headerPlaceholder = layout === 'split' ? 'Enter heading' : 'Enter heading text';
    const subheaderPlaceholder = 'Enter subheading text';
    const disclaimerPlaceholder = 'Enter disclaimer text';

    const hexColorValue = (color) => {
        if (color === 'accent') {
            return getAccentColor();
        }

        if (color === 'transparent') {
            // The editor background is white, so we should force dark text
            return '#ffffff';
        }

        return color;
    };

    const wrapperStyle = () => {
        if (backgroundImageSrc && layout !== 'split') {
            return {
                backgroundImage: `url(${backgroundImageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundColor: 'bg-grey-950',
                color: backgroundImageAverageColor && textColorForBackgroundColor(backgroundImageAverageColor).hex()
            };
        } else if (backgroundColor) {
            return {
                backgroundColor: hexColorValue(backgroundColor),
                color: textColorForBackgroundColor(hexColorValue(backgroundColor)).hex()
            };
        }

        return null;
    };

    return (
        <>
            <div className={clsx(
                'flex bg-transparent font-sans text-black transition-colors ease-in-out dark:text-white',
                (layout === 'regular') && 'min-h-[32vh]',
                (layout === 'wide') && 'min-h-[56vh]',
                (layout === 'full') && 'min-h-[80vh]',
                (layout === 'split') && 'h-[80vh]'
            )} data-testid={'signup-card-container'} style={wrapperStyle()}>
                {layout === 'split' && (
                    backgroundImageSrc
                        ? <img alt="" className="w-[50%] object-cover" src={backgroundImageSrc} />
                        : <div className="flex w-[50%] items-center justify-center bg-gradient-to-t from-black/0 via-black/5 to-black/30"></div>
                )}

                <div className={clsx(
                    'mx-auto flex w-full flex-1 flex-col justify-center',
                    (alignment === 'center') && 'items-center',
                    (layout === 'regular') && 'p-[8vmin] pb-[9vmin]',
                    (layout === 'wide') && 'p-[10vmin] pb-[12vmin]',
                    (layout === 'full') && 'p-[14vmin] pb-[16vmin]',
                    (layout === 'split') && 'px-[6vmin] pt-[16vmin] pb-[18vmin]'
                )}>
                    {/* Heading */}
                    {
                        (isEditing || !!header || !isEditorEmpty(headerTextEditor)) && (
                            <KoenigNestedEditor
                                autoFocus={true}
                                focusNext={subheaderTextEditor}
                                hasSettingsPanel={true}
                                initialEditor={headerTextEditor}
                                initialEditorState={headerTextEditorInitialState}
                                nodes="minimal"
                                placeholderClassName={clsx(
                                    'w-full truncate whitespace-normal !font-bold !leading-[1.15] !tracking-tight opacity-50',
                                    (alignment === 'center') && 'text-center',
                                    (layout === 'regular') && '!text-5xl',
                                    (layout === 'wide') && '!text-6xl',
                                    (layout === 'full' || layout === 'split') && '!text-8xl'
                                )}
                                placeholderText={headerPlaceholder}
                                singleParagraph={true}
                                textClassName={clsx(
                                    'koenig-lexical-header-heading relative w-full whitespace-normal font-bold caret-current [&:has(br)]:text-left',
                                    (alignment === 'center') && 'text-center',
                                    (layout === 'regular') && 'koenig-lexical-header-xsmall',
                                    (layout === 'regular' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_192px)]',
                                    (layout === 'wide' || layout === 'split') && 'koenig-lexical-header-small',
                                    (layout === 'wide' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_238px)]',
                                    (layout === 'full' || layout === 'split') && 'koenig-lexical-header-large',
                                    (layout === 'full' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_374px)]',
                                    (layout === 'split' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_286px)]'
                                )}
                            />
                        )
                    }

                    {/* Subheading */}
                    {
                        (isEditing || !!subheader || !isEditorEmpty(subheaderTextEditor)) && (
                            <KoenigNestedEditor
                                focusNext={disclaimerTextEditor}
                                hasSettingsPanel={true}
                                initialEditor={subheaderTextEditor}
                                initialEditorState={subheaderTextEditorInitialState}
                                nodes="minimal"
                                placeholderClassName={clsx(
                                    'w-full truncate whitespace-normal !font-normal !leading-tight !tracking-[-0.025em] opacity-50',
                                    (alignment === 'center') && 'text-center',
                                    (layout === 'regular') && '!text-xl',
                                    (layout === 'wide') && '!text-2xl',
                                    (layout === 'full' || layout === 'split') && '!text-3xl'
                                )}
                                placeholderText={subheaderPlaceholder}
                                singleParagraph={true}
                                textClassName={clsx(
                                    'koenig-lexical-header-subheading relative w-full whitespace-normal caret-current [&:has(br)]:text-left',
                                    (alignment === 'center') && 'text-center',
                                    (layout === 'regular') && 'koenig-lexical-header-small !mt-2',
                                    (layout === 'regular' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_92px)]',
                                    (layout === 'wide') && 'koenig-lexical-header-medium !mt-3',
                                    (layout === 'wide' && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_108px)]',
                                    (layout === 'full' || layout === 'split') && 'koenig-lexical-header-large !mt-3',
                                    ((layout === 'full' || layout === 'split') && alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_134px)]'
                                )}
                            />
                        )
                    }

                    {/* Subscribe form */}
                    <div className={`${(layout === 'regular') ? 'mt-10 w-9/12' : (layout === 'wide') ? 'mt-12 w-4/6' : (layout === 'full') ? 'mt-16 w-5/12' : 'mt-16 w-full'}`}>
                        <SubscribeForm
                            buttonSize={`${(layout === 'regular') ? 'medium' : (layout === 'wide') ? 'large' : 'xlarge'}`}
                            buttonStyle={buttonColor ? {
                                backgroundColor: hexColorValue(buttonColor),
                                color: textColorForBackgroundColor(hexColorValue(buttonColor)).hex()
                            } : {backgroundColor: `#000000`,
                                color: `#ffffff`}}
                            buttonText={buttonText || 'Subscribe'}
                            dataTestId='signup-card-button'
                            disabled={true}
                            inputBorderStyle={buttonColor ? {
                                border: `1px solid ${hexColorValue(buttonColor)}`
                            } : null}
                            placeholder='yourname@example.com'
                        />
                    </div>

                    {/* Disclaimer */}
                    {
                        (isEditing || !!disclaimer || !isEditorEmpty(disclaimerTextEditor)) && (
                            <KoenigNestedEditor
                                hasSettingsPanel={true}
                                initialEditor={disclaimerTextEditor}
                                initialEditorState={disclaimerTextEditorInitialState}
                                nodes="minimal"
                                placeholderClassName={`truncate opacity-50 w-full whitespace-normal !leading-tight !font-normal !text-[1.6rem] !tracking-[-0.025em] ${(alignment === 'center' && 'text-center')}`}
                                placeholderText={disclaimerPlaceholder}
                                singleParagraph={true}
                                textClassName={`koenig-lexical-header-subheading caret-current koenig-lexical-header-xsmall relative w-full whitespace-normal !mt-4 ${(alignment === 'center' && 'text-center')} [&:has(br)]:text-left ${(alignment === 'center') && '[&:has(br)]:pl-[calc(50%_-_71px)]'}`}
                            />
                        )
                    }

                    {/* Read-only overlay */}
                    {!isEditing && <div className="absolute top-0 z-10 !m-0 h-full w-full cursor-default p-0"></div>}
                </div>
            </div>

            {isEditing &&
                <div className="!mt-0 flex items-center justify-center bg-grey-100 p-2 font-sans text-sm font-normal leading-none text-grey-600 dark:bg-grey-950 dark:text-grey-800">
                    Only visible for posts on the web, this card will not be displayed in emails.
                </div>
            }

            {isEditing && (
                <SettingsPanel className="mt-0">
                    <ButtonGroupSetting
                        buttons={layoutChildren}
                        label='Layout'
                        selectedName={layout}
                        onClick={handleLayout}
                    />
                    <ButtonGroupSetting
                        buttons={alignmentChildren}
                        label='Alignment'
                        selectedName={alignment}
                        onClick={handleAlignment}
                    />
                    {(layout !== 'split') && <ToggleSetting
                        dataTestId='signup-background-image-toggle'
                        isChecked={Boolean(showBackgroundImage)}
                        label='Image'
                        onChange={handleToggleBackgroundImage}
                    />}
                    {(showBackgroundImage || layout === 'split') && <MediaUploadSetting
                        alt='Background image'
                        desc='Click to upload'
                        errors={fileUploader?.errors}
                        hideLabel={layout !== 'split'}
                        icon='file'
                        isDraggedOver={imageDragHandler?.isDraggedOver}
                        isLoading={isUploading}
                        label='Image'
                        mimeTypes={['image/*']}
                        placeholderRef={imageDragHandler?.setRef}
                        progress={progress}
                        size='xsmall'
                        src={backgroundImageSrc}
                        onFileChange={onFileChange}
                        onRemoveMedia={handleClearBackgroundImage}
                    />}
                    <ColorPickerSetting
                        dataTestId='signup-background-color'
                        label='Background'
                        swatches={[
                            {title: 'Brand color', accent: true},
                            {title: 'Black', hex: '#000000'},
                            {title: 'Transparent', transparent: true}
                        ]}
                        value={backgroundColor}
                        onChange={handleBackgroundColor}
                    />
                    <SettingsDivider />

                    <ColorPickerSetting
                        dataTestId='signup-button-color'
                        label='Button'
                        swatches={[
                            {title: 'Brand color', accent: true},
                            {title: 'Black', hex: '#000000'},
                            {title: 'White', hex: '#ffffff'}
                        ]}
                        value={buttonColor}
                        onChange={handleButtonColor}
                    />
                    <InputSetting
                        dataTestId='signup-button-text'
                        label='Button text'
                        placeholder='Add button text'
                        value={buttonText || 'Subscribe'}
                        hideLabel
                        onChange={handleButtonText}
                    />
                    <MultiSelectDropdownSetting
                        dataTestId='labels-dropdown'
                        description='These labels will be applied to members who sign up via this form.'
                        label='Labels'
                        menu={availableLabels}
                        value={labels}
                        onChange={handleLabels}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

SignupCard.propTypes = {
    alignment: PropTypes.oneOf(['left', 'center']),
    header: PropTypes.string,
    subheader: PropTypes.string,
    disclaimer: PropTypes.string,
    buttonText: PropTypes.string,
    buttonPlaceholder: PropTypes.string,
    backgroundImageSrc: PropTypes.string,
    backgroundColor: PropTypes.string,
    buttonColor: PropTypes.string,
    showBackgroundImage: PropTypes.bool,
    isEditing: PropTypes.bool,
    fileUploader: PropTypes.object,
    fileInputRef: PropTypes.object,
    handleLayout: PropTypes.func,
    handleAlignment: PropTypes.func,
    handleButtonText: PropTypes.func,
    handleClearBackgroundImage: PropTypes.func,
    handleBackgroundColor: PropTypes.func,
    handleToggleBackgroundImage: PropTypes.func,
    handleButtonColor: PropTypes.func,
    handleLabels: PropTypes.func,
    labels: PropTypes.arrayOf(PropTypes.string),
    layout: PropTypes.oneOf(['regular', 'wide', 'full', 'split']),
    availableLabels: PropTypes.arrayOf(PropTypes.object),
    openFilePicker: PropTypes.func,
    onFileChange: PropTypes.func,
    imageDragHandler: PropTypes.object,
    headerTextEditor: PropTypes.object,
    headerTextEditorInitialState: PropTypes.string,
    subheaderTextEditor: PropTypes.object,
    subheaderTextEditorInitialState: PropTypes.string,
    disclaimerTextEditor: PropTypes.object,
    disclaimerTextEditorInitialState: PropTypes.string
};
