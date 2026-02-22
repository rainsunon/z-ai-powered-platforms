package com.xrs.commonlib.csv;

import com.xrs.commonlib.csv.anotation.CsvColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseCsv {
    @CsvColumn(columnName = "Id")
    private Long id;
}
