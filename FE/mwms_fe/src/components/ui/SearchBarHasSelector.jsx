import css from '../../styles/ui/SearchBar.module.css'
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

SearchBarHasSelector.propTypes = {
    mainWidth: PropTypes.number.isRequired,
    mainMarginBottom: PropTypes.number.isRequired,
    mainMarginTop: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    searchInputParams: PropTypes.shape({
        grow: PropTypes.number.isRequired,
        mr: PropTypes.number.isRequired,
        ph: PropTypes.string.isRequired,
    }).isRequired,
    searchSelectorParams: PropTypes.shape({
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
        grow: PropTypes.number.isRequired,
        mr: PropTypes.number.isRequired,
    }).isRequired,
    searchFunc: PropTypes.func.isRequired
}

/* eslint-disable react/prop-types*/
function RenderSearchBar(
    {
        mainWidth,
        height,
        searchInputParams,
        searchSelectorParams,
        searchFunc
    }
) {
    const [value, setValue] = useState({
        keyword: "",
        type: searchSelectorParams.value[0]
    })

    useEffect(() => {
        searchFunc(value.keyword, value.type)
    }, [value])

    return (
        <div className={css.search_bar} style={{width: mainWidth + 'vw'}}>
            <div className={css.search_input} style={{flexGrow: searchInputParams.grow, marginRight: searchInputParams.mr + 'vw', height: height + 'vh'}}>
                <input type={"text"} placeholder={searchInputParams.ph} onChange={(e) => setValue({...value, keyword: e.target.value})}/>
            </div>
            <div className={css.search_selector} style={{flexGrow: searchSelectorParams.grow, marginRight: searchSelectorParams.mr + 'vw', height: height + 'vh'}}>
                <select onChange={(e) => setValue({...value, type: e.target.value})}>
                    {
                        searchSelectorParams.value.map((item, index) => (
                            <option
                                key={index}
                                value={item}>{item.substring(0, 1).toUpperCase() + item.substring(1)}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

export function SearchBarHasSelector(
    {
        mainWidth,
        mainMarginBottom,
        mainMarginTop,
        height,
        searchInputParams,
        searchSelectorParams,
        searchFunc
    }
) {
    const prop = {
        mainWidth,
        height,
        searchInputParams,
        searchSelectorParams,
        searchFunc
    }

    return (
        <div className={css.main} style={{width: mainWidth + 'vw', marginBottom: mainMarginBottom + 'vh', marginTop: mainMarginTop + 'vh'}}>
            <RenderSearchBar {...prop}/>
        </div>
    )
}