CREATE OR REPLACE FUNCTION COOLSTUFF.BASH (
            MESSAGE_DATA CLOB(64512)
    )
    RETURNS TABLE (
        OUTPUTLINE CLOB(64512) CCSID 1208
    )
    LANGUAGE SQL
    SPECIFIC COOLSTUFF.BASH
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    CALLED ON NULL INPUT
    NOT FENCED
    SET OPTION ALWBLK = *ALLREAD,
               ALWCPYDTA = *OPTIMIZE,
               COMMIT = *NONE,
               DECRESULT = (31,
               31,
               00),
               DYNDFTCOL = *NO,
               DYNUSRPRF = *USER,
               SRTSEQ = *HEX
    BEGIN
        DECLARE UNIQUIFIER VARCHAR(100);
        DECLARE LOCAL_MESSAGE_DATA_UTF8 CLOB(64512) CCSID 1208;
        DECLARE LOCAL_KEY_DATA VARCHAR(1000);
        SET UNIQUIFIER = QSYS2.JOB_NAME CONCAT QSYS2.THREAD_ID CONCAT CURRENT_TIMESTAMP;
        SET LOCAL_KEY_DATA = RPAD(UNIQUIFIER, 100, 'J');
        CALL QSYS2.SEND_DATA_QUEUE_UTF8(
            DATA_QUEUE_LIBRARY => 'COOLSTUFF',
            DATA_QUEUE => 'BASHQ',
            MESSAGE_DATA => MESSAGE_DATA,
            KEY_DATA => LOCAL_KEY_DATA
        );
        SELECT MESSAGE_DATA_UTF8
            INTO LOCAL_MESSAGE_DATA_UTF8
            FROM
                TABLE (
                    QSYS2.RECEIVE_DATA_QUEUE(
                        DATA_QUEUE_LIBRARY => 'COOLSTUFF',
                        DATA_QUEUE => 'BASHQ2', KEY_DATA => LOCAL_KEY_DATA, KEY_ORDER => 'EQ',
                        WAIT_TIME => 9999)
                );
        RETURN SELECT ELEMENT AS OUTPUTLINE
                FROM TABLE (
                        SYSTOOLS.SPLIT(LOCAL_MESSAGE_DATA_UTF8, '
')
                    ) AS J
                ORDER BY ORDINAL_POSITION;
    END; 