import classNames from 'classnames'
import { useState } from 'react'

import css from './SettingsMenu.module.scss'
import { CheckIcon } from './icons/CheckIcon'
import { RightArrowIcon } from './icons/RightArrowIcon'

export interface Option {
  title: string
  value: number
}

export interface Section {
  id: string
  title: string
  options: Option[]
  defaultOption?: number
}

export interface Settings {
  [sectionId: string]: number
}

export interface SettingsMenuProps {
  isMobile: boolean
  sections: Section[]
  settings: Settings
  onChange: (sectionId: string, value: number) => void
}

export function SettingsMenu(props: SettingsMenuProps) {
  const { isMobile, sections, settings, onChange } = props

  const [currentSection, setCurrentSection] = useState<Section>()

  const getSelectedOptionIndex = (section: Section): number => {
    const selectedValue = settings[section.id]

    return selectedValue !== undefined
      ? section.options.findIndex((s) => s.value === selectedValue)
      : section.defaultOption || 0
  }

  const getSelectedOptionTitle = (section: Section): string => {
    const optionIndex = getSelectedOptionIndex(section)
    const option = section.options[optionIndex]
    return option ? option.title : ''
  }

  const selectOption = (option: Option): void => {
    if (!currentSection) return
    onChange(currentSection.id, option.value)
    setCurrentSection(undefined)
  }

  return (
    <ul
      className={classNames({
        [css.root]: true,
        [css.isSelecting]: currentSection !== undefined,
        [css.isDesktop]: !isMobile,
      })}
    >
      {currentSection ? (
        <>
          <li>
            <button
              className={classNames(css.btn, css.backBtn)}
              onClick={() => setCurrentSection(undefined)}
            >
              <RightArrowIcon className={css.arrowIcon} />
              {currentSection.title}
            </button>
          </li>
          <ul className={css.options}>
            {currentSection.options.map((option, optionIdx) => (
              <li key={option.title}>
                <button
                  className={classNames({
                    [css.btn]: true,
                    [css.optionBtn]: true,
                    [css.isActive]:
                      getSelectedOptionIndex(currentSection) === optionIdx,
                  })}
                  onClick={() => selectOption(option)}
                >
                  <CheckIcon className={css.checkIcon} />
                  {option.title}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        sections.map((section) => (
          <li key={section.id}>
            <button
              className={css.btn}
              onClick={() => setCurrentSection(section)}
            >
              {section.title}
              <div className={css.selection}>
                {getSelectedOptionTitle(section)}
              </div>
              <RightArrowIcon className={css.arrowIcon} />
            </button>
          </li>
        ))
      )}
      {isMobile && (
        <li>
          <button className={classNames(css.btn, css.cancelBtn)}>Cancel</button>
        </li>
      )}
    </ul>
  )
}
