package com.cjh.websocket.utility;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.alibaba.fastjson.JSON;

public class ToJsonUtil {

    /**
     * 入参：所有类型
     * 出参：json
     * 方法作用：将入参转化成json类型的，如果有时间可以转成yyyy-MM-dd格式
     * 作者: zengwei
     */
    public static void toJSONStringWithDateFormat(HttpServletResponse response, Object object) {

        String jsonStringWithDateFormat = JSON.toJSONStringWithDateFormat(object, "yyyy-MM-dd");
        try {
            response.getWriter().write(jsonStringWithDateFormat);
            response.setContentType("application/json;charset=utf-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
