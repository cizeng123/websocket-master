package com.cjh.websocket.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

public class SessionInterceptor implements HandlerInterceptor {


    /**
     * 执行前
     *
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object isOkObj = session.getAttribute("isOk");
        if (isOkObj instanceof Integer && (Integer) isOkObj == 1) {
            return true;
        }
        response.sendRedirect("https://www.ourproteinfactory.com/servicecenter");
        return false;
    }

    /**
     * 页面渲染前
     *
     * @param request
     * @param response
     * @param handler
     * @param modelAndView
     * @throws Exception
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    /**
     * 执行后
     *
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @throws Exception
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }


    public static void main(String[] args) {
        String str = "12345";
        List<String> result = getResult(str.toCharArray(), new ArrayList<>(), str.length());
        result.forEach(System.out::println);
        System.out.println(result.size());
    }

    private static List<String> getResult(char[] chars, List<String> result, int l) {
        for (char c : chars) {
            result.add(c + "");
        }
        setResult(chars, result, l);
        return result;
    }

    private static void setResult(char[] chars, List<String> result, int l) {
        int length = result.get(result.size() - 1).length();
        List<String> list = new ArrayList<>(result);
        for (char c : chars) {
            for (String str : list) {
                if (!str.contains(String.valueOf(c)) && str.length() == length) {
                    result.add(c + str);
                }
            }
        }
        if (result.get(result.size() - 1).length() < l) {
            setResult(chars, result, l);
        }
    }

}
